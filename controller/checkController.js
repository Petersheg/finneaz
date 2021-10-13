const axios = require('axios');
const catchAsync = require('../utility/catchAsync');
const AppError = require('../utility/appError');
const History = require('../model/vehicleHistory');
const helperFunction = require('../utility/helperFunction');

exports.checkReportStatus = catchAsync(

    async (req,res, next)=>{

        const VIN = req.query.vin;
        const vinExistInHistory = await History.findOne({vin : VIN});

        if(vinExistInHistory){

            // check if user making this request already did before
            const userExist =  await History.findOne({
                users : {$eq : req.user._id}
            });

            // If user exist then do not debit and send request
            if(userExist){
                await helperFunction.callCarFaxAndDebit(req,res,VIN,0);
            }

            // if user does not exist push user. 
            if(!userExist){

                vinExistInHistory.users.push(req.user._id)//Add user to history
                vinExistInHistory.save({validateBeforeSave : false});

                await helperFunction.callCarFaxAndDebit(req,res,VIN,5);
                
            }

        };

        if(!vinExistInHistory){
            await helperFunction.callCarFaxAndDebit(req,res,VIN,5);
        };
    }
);