const catchAsync = require('../utility/catchAsync');
const User = require('./../model/userModel');
const AppError = require('../utility/appError');
const sentVerificationMail = require('../utility/emails/sendVerificationEmail'); 

exports.resentEmail = catchAsync(
    
    async (req,res, next) => {

        const email = req.body.email;

        const user = await User.findOne({userEmail:email});

        if(!user){
            return next(new AppError("User with this email does not exist",401));
        }

        if(user.emailConfirmationStatus){
            return next(new AppError("Your account is already activated"));
        }

        // Delete linkToken and linkTokenExpires
        user.linkToken = undefined,
        user.linkTokenExpires = undefined
        await user.save({validateBeforeSave : false});

        await sentVerificationMail.sentVerificationMail(user,req, res,next);
    }
)