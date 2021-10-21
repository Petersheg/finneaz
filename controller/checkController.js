const catchAsync = require('../utility/catchAsync');
const History = require('../model/vehicleHistory');
const helperFunction = require('../utility/helperFunction');

exports.checkReportStatus = catchAsync(

    async (req,res, next)=>{

        const VIN = req.query.vin;
        
        if(!VIN){
            return next(new AppError("You must provide a VIN",402));
        }

        const vinExistInHistory = await History.findOne({vin : VIN});

        if(vinExistInHistory){

            // check if user making this request already did before
            const userExist =  await History.findOne({
                users : {$eq : req.user._id}
            });

            // If user exist then do not debit and send request
            if(userExist){
                await helperFunction.callCarFaxAndDebit(req,res,VIN,0,next);
            }

            // if user does not exist push user. 
            if(!userExist){

                await helperFunction.callCarFaxAndDebit(req,res,VIN,5,next);

                //vinExistInHistory.users.push(req.user._id)//Add user to history
                //vinExistInHistory.save({validateBeforeSave : false});
            }

        };

        if(!vinExistInHistory){
            await helperFunction.callCarFaxAndDebit(req,res,VIN,5,next);
        };
    }
);