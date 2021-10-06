const catchAsync = require('../catchAsync');
const AppError = require('../appError');
const helperFunction = require('../helperFunction');
const sendAnyEmail = require('./sendGrid');

exports.sentVerificationMail = async (user,req,res,next) => {
    
    const tokenLink = user.generateLinkToken();
    await user.save({validateBeforeSave : false});

    const activationLink = `${req.protocol}//${req.get('host')}/api/v1/users/verify_email/${tokenLink}`;

    const message = `<h3> Hi ${user.userFullName}</h3>
    <p> You must verify your email address to complete your registration
        Kindly click on the <a href = ${activationLink}> activation link </a> 
        to complete your registration.
    </p>`
    
    let token, data;
    let email = user.userEmail;

    if (req.originalUrl.includes("signup")) {

        token = token = helperFunction.generateJWToken(user._id);
        data = {
            user
        }
    }else{

        token = undefined;
        data = {
            email
        }
    }

    try{

        await sendAnyEmail({
            email : user.userEmail,
            subject : `WELCOME ${user.userFullName}, KINDLY ACTIVATE YOUR EMAIL.`,
            message
        });

        res.status(201).json({
            status: "success",
            message : "Message sent, Kindly check your email.",
            token,
            data
        })

    }catch(err){

        if (req.originalUrl.includes("signup")) {
            user.linkToken = undefined,
            user.linkTokenExpires = undefined
    
            await user.save({validateBeforeSave : false});
            return next( new AppError('Message sending failed',500));
        }else{
            return next( new AppError('Message sending failed',500));
        }

       
    }
}