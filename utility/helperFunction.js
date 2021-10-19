const jwt = require('jsonwebtoken');
const axios = require('axios')
const Services = require('../services/main');
const logger = require('../utility/logger');
const AppError = require('../utility/appError');
const History = require('../model/vehicleHistory');

async function getCarReport(req){

    try{
        
        const VIN = req.query.vin;
        
        if(!VIN){
            return next(new AppError("You must provide a VIN",402));
        }

        const reportURL = 
        `${process.env.CARFAX_BASE_URL}/report?key=${process.env.CARFAX_KEY}&vin=${VIN}&type=carfax`;

        // if report is available then make call to get the information
        let reportHTML = await axios({
            method : 'get',
            url : reportURL
        })

        // Creat new history
        const vinExist = await History.findOne({vin : VIN});
        const userExist = await History.findOne({users : {$eq : req.user._id}});

        if(vinExist && !userExist){
            vinExist.users.push(req.user._id);
            await vinExist.save({runValidators: true});

        }
        
        if(!vinExist){
            let history = await History.create({
                vin : VIN,
            
            });

            history.users.push(req.user._id);
            await history.save({runValidators: true});
        }
        

        return reportHTML.data;

    }catch(err){
        logger.Report({
            service: 'controller::checkController::getCarReport',
            message : err.message,
        });
    }
}

async function checkAvailability(req){

    try{
        const VIN = req.query.vin;

        const checkURL = 
        `${process.env.CARFAX_BASE_URL}/check?key=${process.env.CARFAX_KEY}&vin=${VIN}&type=carfax`;

        
        // call to get the report availability
        const checkStatus = await axios({
            method : 'get',
            url : checkURL
        })

        return checkStatus.data.status;

    }catch(err){

        logger.Report({
            service : 'controller::checkController::checkAvailability',
            message : err.message,
        });
    }
}

exports.generateJWToken = (id) => {

    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn : process.env.JWT_EXPIRED_AFTER
    });
};

exports.sendTokenAsResponse = (statusCode,user,res,message) =>{
    const userId = user._id;
    
    const token = jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn : process.env.JWT_EXPIRED_AFTER
    }) 
    
    res.cookie('token',token,{maxAge:24 * 60 * 60 * 1000}); //Expires After 24 hours

    res.status(statusCode).json({
        status : 'success',
        message,
        token,
        data : {
            user
        }
    })
}


exports.callCarFaxAndDebit = async (req,res,vin,amountToDebit,next)=>{
    let message = `Vehicle report with the ${vin} has generated!`;

    const obj = {
        type : 'debit',
        status : 'successful',
        reason : 'check report',
        user : req.user._id
    }

    try{

        const service = new Services(obj,req.user);
        // Check VIN availability
        const vinIsAvailable = await checkAvailability(req);

        if(!vinIsAvailable){
            return next(new AppError('Car report is not available',404));
        }

        if(vinIsAvailable && await service.debitWallet(amountToDebit)){

            const report = await getCarReport(req);
    
            res.status(200).json({
                status :'success',
                message,
                data : {
                    report
                } 
            })
    
        }else{
            return next(new AppError('Your Account is not sufficient',400));
        }
    }catch(err){

        logger.Report({
            service: 'controller::checkController::getCarReport',
            message : err.message ?? "something went wrong",
        });
    }
}