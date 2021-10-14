const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('./../../model/userModel');
const catchAsync = require('./../../utility/catchAsync');
const AppError = require('./../../utility/appError');
const sendAnyEmail = require('../../utility/emails/sendGrid');
const logger = require('./../../utility/logger');
const sentVerificationMail = require('../../utility/emails/sendVerificationEmail');
const helperFunction = require('../../utility/helperFunction');

exports.signup = catchAsync(
    async (req, res, next) => {

        const user = await User.create({
            userName : req.body.userName,
            userFullName : req.body.userFullName,
            userMobile : req.body.userMobile,
            userEmail : req.body.userEmail,
            password : req.body.password,
            confirmPassword : req.body.confirmPassword,
        });

        const token =  helperFunction.generateJWToken(user._id);

        // If token has been generated then send email to userEmail

        if(token){
            await sentVerificationMail.sentVerificationMail(user,req,res,next);
        };
    }
)

exports.verifyEmail = catchAsync(

    async (req,res,next)=>{
       
        const linkToken = req.params.linkToken;
        const hashedLinkToken = crypto.createHash('sha256').update(linkToken).digest('hex');

        const user = await User.findOne({linkToken : hashedLinkToken});//Look up user base on linkToken

        if(!user){
            return next(new AppError('User does not exist',404))
        }

        try{
            // If user exist set email confirmation to activated and delete linkToken.
            user.emailConfirmationStatus = true;

            user.linkToken = undefined;
            user.linkTokenExpires = undefined;

            await user.save({validateBeforeSave : false});

            res.status(200).json({
                status : 'success',
                message : 'Email successfully activated, Kindly login',
            })

        }catch(err){

            logger.Report({
                services : 'controller::authController::user::verifyEmail',
                message : err.message
            })

            return next( new AppError('Can\'t validate user, kindly try again',500));
        }
    }
)

exports.login = catchAsync(
    async (req,res, next)=>{
        // get user credentials from request body
        const {email,password} = req.body;

        const message = "login successful" 

        // Check if any field is not missing
        if(!email || !password){
            return next(new AppError('Email and Password is required',400));
        };

        // if email and password is provided check it against the data in the DB
        const user = await User.findOne({userEmail:email}).select('+password');//user lookup
        
        // If no user or no password in DB then throw error
        if(!user || !await user.passwordCheck(password,user.password)){
            return next(new AppError('Email or Password is not correct',400));
        }

        // If user do not verify their email, throw error.
        if(!user.emailConfirmationStatus){
            return next(new AppError(`Hi ${user.userName} Kindly verify your email before you log in.`,401))
        }

        // Else send user new token
        helperFunction.sendTokenAsResponse(200,user,res,message);
    }
)

exports.protect = catchAsync(
    async (req,res,next)=>{

        const headers = req.headers.authorization;
        let token;

        if(headers && headers.startsWith('Bearer')){
            token = headers.split(' ')[1]
        }

        if(!token){
            return next(new AppError('You are not allowed to access this page.'),400)
        }

        // Validate Token
        const userValidate = jwt.verify(token,process.env.JWT_SECRET);
        const currentUser = await User.findById(userValidate.userId).select('+password');
        
        // Check if user still exist
        if(!currentUser){
            return next(new AppError('Invalid token, kindly re login and try again',401));
        }

        if(currentUser.passwordChangedAfterTokenIssued(userValidate.iat)){
            return next(new AppError('You recently changed your password, kindly re-login',401));
        }

        req.user = currentUser; //Set current user on req for later user.
        next();
    }
);

exports.forgotPassword = catchAsync(

    async (req,res, next)=>{

        const email = req.body.email;
        const user = await User.findOne({userEmail : email}).select('+password');

        if(!user){
            return next(new AppError(`User with ${email} does not exist`,404));
        }

        // generate a reset token and set it on user model;
        const resetToken = user.generateLinkToken(); //instance method
        await user.save({validateBeforeSave : false}); //save changes to model

        const resetURL = `${req.get('host')}/api/v1/users/resetpassword/${resetToken}`
        //${req.protocol}
        
        
        const message = `<h1>Hi ${user.userFullName}</h1>
                    <p>Kindly click on this <a href = ${resetURL}> reset link </a> to reset your password</p>
                    <p>If you did not request a password rest, kindly ignore</p>`

        try{

            await sendAnyEmail({
                email : user.userEmail,
                subject : 'Reset Password Email (Expires After 10 minutes)',
                message
            });

            res.status(200).json({
                status : 'success',
                message : 'Reset mail sent successfully, kindly check your email'
            });

        }catch(err){

            user.linkToken = undefined;
            user.linkTokenExpires = undefined;

            await user.save({validateBeforeSave : false});

            // Slack Error Logger
            logger.Report({
                service : 'controller::authController::users::forgotPassword',
                message : err.message
            })

            return next(new AppError('Error sending email, kindly try again',500))
        }
    }
);

exports.resetPassword = catchAsync(
    async (req,res, next)=> {
        const plainResetToken = req.params.resetToken;
        const hashedResetToken = crypto.createHash('sha256').update(plainResetToken).digest('hex');

        const message = "Password was reset successfully";
        
        const user = await User.findOne({
            linkToken : hashedResetToken,
            linkTokenExpires : {$gt  : Date.now() }
        });

        if(!user){
            return next(new AppError('Invalid token', 404));
        }

        const {password, confirmPassword} = req.body;
        user.password = password;
        user.confirmPassword = confirmPassword;

        user.linkToken = undefined;
        user.linkTokenExpires = undefined;
        await user.save();

        helperFunction.sendTokenAsResponse(200,user,res,message);
        
    }
);

exports.updatePassword = catchAsync(
    async (req,res,next)=>{
        const currentUser = req.user;
        const message = "Password updated!";

        if(!currentUser){
            return next(new AppError('Invalid token, kindly try and log in again.',401));
        };

        const currentPassword = req.body.currentPassword;
        const passCheck = await currentUser.passwordCheck(currentPassword,currentUser.password);

        if(!passCheck) {
            return next(new AppError('current password provided is wrong,',401));
        }

        currentUser.password = req.body.password,
        currentUser.confirmPassword = req.body.confirmPassword;
        await currentUser.save();

        helperFunction.sendTokenAsResponse(200,currentUser,res,message);
    }
);