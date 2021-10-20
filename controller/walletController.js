const catchAsync = require('../utility/catchAsync');
const AppError = require('../utility/appError');
const User = require('../model/userModel');

exports.returnWallet = catchAsync(
    
    async(req,res, next)=>{

        const userId = req.params.userId;

        if(!userId){
            return next(new AppError('You can not access this route',403))
        }
        const currentUser = await User.findOne({_id : userId});

        if(!currentUser){
            return next(new AppError('User not found',404))
        }

        const wallet = currentUser.wallet[0];

        if(currentUser){
            res.status(200).json({
                status : 'success',
                message : "wallet fetched",
                data : {
                    wallet
                }
            })
        }
    }
)