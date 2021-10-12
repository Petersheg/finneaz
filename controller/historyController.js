const catchAsync = require('../utility/catchAsync');
const AppError = require('../utility/appError');
const History = require('../model/vehicleHistory');

exports.getHistoryByUser = catchAsync(

    async (req,res,next)=>{

        let filter = {};

        const userId = req.params.userId;
        const currentUserId = req.user._id;

        if(currentUserId != userId){
            return next(new AppError('Invalid user!',401));
        }

        if(!userId){
            return next(new AppError('You can not access this route'));
        }

        if(userId) filter = {users : userId}
        const vehicleHistories = await History.find(filter)//.populate('users');

        if(!vehicleHistories || vehicleHistories.length === 0){
            return next(new AppError('No history available for this user',404));
        }

        res.status(200).json({
            status : true,
            message :  `History with the user id ${req.user._id} fetched`,
            vehicleHistories
        })
    }
)