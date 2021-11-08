const jwt = require('jsonwebtoken');
const {OAuth2Client} = require('google-auth-library')
const User = require('./../../model/userModel');
const catchAsync = require('./../../utility/catchAsync');
const AppError = require('./../../utility/appError');
const helperFunction = require('./../../utility/helperFunction');

exports.googleOAuth2 = catchAsync(
    async (req, res, next) =>{

        const oAuth2Client = new OAuth2Client(
            process.env.GOOGLE_CLIENT_ID,
        );

        const tokenId = req.body.tokenId; 
        const tokenInfo = await oAuth2Client.verifyIdToken({
            idToken: tokenId,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const {email,name,email_verified} = tokenInfo.payload;
        const userName = email.split('@')[0];
        // check if user already exists
        const findUser = await User.findOne({userEmail: email});
        
        if(findUser){
            helperFunction.sendTokenAsResponse(200,findUser,res,"login successful");
        }

        if(!findUser){
            
            let emailConfirmationStatus;
            if(email_verified){
                emailConfirmationStatus = true
            }

            const newUser = new User({
                userFullName : name,
                userName,
                userEmail : email,
                emailConfirmationStatus 
            })

            await newUser.save({validateBeforeSave : false});

            helperFunction.sendTokenAsResponse(200,newUser,res,"sign up successful");
        }

    }
)