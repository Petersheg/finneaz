const jwt = require('jsonwebtoken');
const User = require('./../../model/userModel');
const catchAsync = require('./../../utility/catchAsync');
const AppError = require('./../../utility/appError');

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

        res.status(201).json({
            status : 'success',
            token,
            data : {
                user
            }
        });
    }
);

exports.login = catchAsync(
    async (req,res, next)=>{
        // get user credentials from request body
        const {userEmail,password} = req.body;

        // Check if any is not missing
        if(!userEmail || !password){
            return next(new AppError('Email and Password is required',400));
        };

        // if email and password is provided check it against the data in the DB
        const user = await User.findOne({userEmail}).select('+password');//user lookup
        
        // If no user or no password in DB then throw error
        if(!user || !await user.passwordCheck(password,user.password)){
            return next(new AppError('Email or Password is not correct',400));
        }

        // Else send user new token
        const token = generateJWToken(user._id);
        res.status(200).json({
            status : 'success',
            token
        })
    }
);

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

        console.log(currentUser);
        req.user = currentUser; //Set current user on req for later user.
        next();
    }
);
