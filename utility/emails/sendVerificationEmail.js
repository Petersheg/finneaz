const catchAsync = require('../catchAsync');
const AppError = require('../appError');
const helperFunction = require('../helperFunction');
const sendAnyEmail = require('./sendGrid');
const template = require('./emailTemplate');
const logger = require('../logger');

exports.sentVerificationMail = async (user,req,res,next) => {
    
    const validTill = 48 * 60 //48 hours;
    const tokenLink = user.generateLinkToken(validTill);
    await user.save({validateBeforeSave : false});

    // const activationLink = `${req.protocol}//${req.get('host')}/api/v1/users/verifyemail/${tokenLink}`;
    const activationLink = `${process.env.BASE_URL}/users/verifyemail/${tokenLink}`;

    let emailObj = {
        user,
        greeting : "WELCOME",
        heading : `KINDLY VERIFY YOUR EMAIL.`,

        message : `A warm welcome to CHECKMAN, We are glad to have you here, We help you prevent buying a faulty ride,
                    you have taken the first step, complete the next by verifying your 
                    email address to complete your registration.
                    Kindly click on the verify button bellow to complete your registration.`,

        link : activationLink,
        buttonText : "VERIFY",

    }

    const message = template.generateTemplate(emailObj);
    
    let token, data;
    let email = user.userEmail;

    if (req.originalUrl.includes("signup")) {

        user.toJSON();
        token = helperFunction.generateJWToken(user._id);

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
            subject : `ACTIVATE YOUR ACCOUNT.`,
            message
        });

        res.status(201).json({
            status: "success",
            message : "Message sent, Kindly check your email.",
            token,
            data
        })

    }catch(err){

        logger.Report({
            service : 'utility::emails::sendVerificationEmail',
            message : err.message
        })

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