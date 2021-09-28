const catchAsync = require('../utility/catchAsync');
const AppError = require('../utility/appError');
const History = require('../model/vehicleHistory');

exports.getHistoryByUser = catchAsync(

    async (req,res,next)=>{
        let filter = {};
        const userId = req.params.userId;
        console.log(userId);

        if(!userId){
            return next(new AppError('You can not access this route'));
        }

        if(userId) filter = {users : userId}
        const vehicleHistories = await History.find(filter);

        if(!vehicleHistories || vehicleHistories.length === 0){
            return next(new AppError('No history available for this user'));
        }

        res.status(200).json({
            status : true,
            message :  `History with the user id ${req.user._id} fetched`,
            vehicleHistories
        })
    }
)