const axios = require('axios');
const catchAsync = require('../utility/catchAsync');
const AppError = require('../utility/appError');
const History = require('../model/vehicleHistory');
const Services = require('../services/main');
const logger = require('../utility/logger');

async function getCarReport(req){
    try{
        
        const VIN = req.query.vin;
    
        const reportURL = 
        `${process.env.CARFAX_BASE_URL}/report?key=${process.env.CARFAX_KEY}&vin=${VIN}&type=carfax`;

        // if report is available then make call to get the information
        let reportHTML = await axios({
            method : 'get',
            url : reportURL
        })

        // Creat new history
        const history = await History.create({
            vin : VIN,
            
        }); 
        history.users.push(req.user._id);
        await history.save({runValidators: true});

        
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

exports.checkReportStatus = catchAsync(

    async (req,res, next)=>{

        const VIN = req.query.vin;
        const vinExistInHistory = await History.findOne({vin : VIN});
        
        const obj = {
            type : 'debit',
            status : 'successful',
            reason : 'check report',
            user : req.user._id
        }

        const service = new Services(obj,req.user);

        // vinExistInHistory 
        // I have to silent this part of the implementation for frontend services
        if(false){

            // check if user making this request already did before
            const userExist =  await History.findOne({
                users : {$eq : req.user._id}
            });

            // If user exist then do not debit and send request
            if(userExist){

                return res.status(200).json({
                    status : true,
                    vinExistInHistory
                })

            }

            // if user does not exist and there is enough balance then debit user 
            
            if(!userExist && await service.debitWallet(5)){

                vinExistInHistory.users.push(req.user._id)//Add user to history
                vinExistInHistory.save({validateBeforeSave : false});

                res.status(200).json({
                    status : true,
                    vinExistInHistory
                })
                
            }else {
                return next(new AppError('You do not have sufficient balance', 401));

            }

        }

        if(!vinExistInHistory){
            // Bellow codes belongs in here!!!!
        }

        let message = `Vehicle report with the ${VIN} has generated!`;

        // Check VIN availability
        const vinIsAvailable = await checkAvailability(req);

        if(!vinIsAvailable){
            return next(new AppError('Car report is not available',404));
        }

        if(vinIsAvailable && await service.debitWallet(5)){
            const report = await getCarReport(req);

            res.status(200).json({
                status : true,
                message,
                report 
            })
        }else{
            return next(new AppError('Your Account is not sufficient',400));
        }
 }
);