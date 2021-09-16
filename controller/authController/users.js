const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('./../../model/userModel');
const catchAsync = require('./../../utility/catchAsync');
const AppError = require('./../../utility/appError');
const sendEmail = require('../../utility/emails/sendEmail');

const generateJWToken = (id) => {

    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn : process.env.JWT_EXPIRED_AFTER
    });
}

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

        const token = generateJWToken(user._id);

        // If token has been generated then send email to userEmail

        if(token){

            const tokenLink = user.generateLinkToken();
            await user.save({validateBeforeSave : false});

            const activationLink = `${req.protocol}//${req.get('host')}/api/v1/users/verify_email/${tokenLink}`;

            const message = `<h3> Hi ${user.userFullName}</h3>
            <p> You must verify your email address to complete your registration
                Kindly click on the <a href = ${activationLink}> activation link </a> 
                to complete your registration.
            </p>`
            

            try{
                await sendEmail({
                    email : user.userEmail,
                    subject : `WELCOME ${user.userFullName}, KINDLY ACTIVATE YOUR EMAIL.`,
                    message 
                });

                res.status(201).json({
                    status: "success",
                    message : "Message sent, Kindly check your email for email activation ",
                    token,
                    data : {
                        user
                    }
                })

            }catch(err){
                user.linkToken = undefined,
                user.linkTokenExpires = undefined

                await user.save({validateBeforeSave : false});
                console.log(err);
                return next( new AppError('Message sending failed',500));
            }
        };

        // res.status(201).json({
        //     status : 'success',
        //     token,
        //     data : {
        //         user
        //     }
        // });
    }
)

exports.verifyEmail = catchAsync(

    async (req,res,next)=>{
       
        const linkToken = req.params.linkToken;
        const hashedLinkToken = crypto.createHash('sha256').update(linkToken).digest('hex');

        const user = await User.findOne({linkToken : hashedLinkToken});//Look up user base on linkToken

        if(!user){
            return next(new AppError('User does not exist'))
        }

        try{
            // If user exist set email confirmation to activated and delete linkToken.
            user.emailConfirmation = 'Activated'

            user.linkToken = undefined;
            user.linkTokenExpires = undefined;

            await user.save({validateBeforeSave : false});

            res.status(200).json({
                status : 'success',
                message : 'Email successfully activated, Kindly login',
            })

        }catch(err){
            return next( new AppError('something went wrong, kindly try again',405));
        }
    }
)

exports.login = catchAsync(
    async (req,res, next)=>{
        // get user credentials from request body
        const {email,password} = req.body;

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
        if(user.emailConfirmation === "Pending"){
            return next(new AppError(`Hi ${user.userName} Kindly verify your email before you log in.`,401))
        }

        // Else send user new token
        const token = generateJWToken(user._id);
        res.status(200).json({
            status : 'success',
            token
        })
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
        const currentUser = await User.findById(userValidate.id);

        // Check if user still exist
        if(!currentUser){
            return next(new AppError('Invalid token, kindly re login and try again'));
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

        const resetURL = `${req.protocol}//${req.get('host')}/api/v1/users/resetpassword/${resetToken}`

        const message = `<h1>Hi ${user.userFullName}</h1>
                    <p>Kindly click on this <a href = ${resetURL}> reset link </a> to reset your password</p>
                    <p>If you did not request a password rest, kindly ignore</p>`

        try{

            await sendEmail({
                email : user.userEmail,
                subject : 'Reset Password Email (Expires After 10 minutes)',
                message
            })

            res.status(200).json({
                status : 'success',
                message : 'Reset mail sent successfully, kindly check your email to continue'
            });

        }catch(err){
            user.linkToken = undefined;
            user.linkTokenExpires = undefined;

            await user.save({validateBeforeSave : false});
            return next(new AppError('Error sending email, kindly try again',500))
        }
    }
);
