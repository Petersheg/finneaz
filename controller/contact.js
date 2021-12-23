const catchAsync = require('../utility/catchAsync');
const AppError = require('../utility/appError');
const sendAnyEmail = require('../utility/emails/sendGrid');
const User = require('../model/user');


exports.contact = catchAsync(

    async (req,res,next)=>{

        const {email,name,message} = req.body;
        if(!email || !name || !message){
            return next(new AppError("All field are required",400));
        }
        await User.create({name,email});
        const options = {
            subject : `Message from ${name}`,
            message: `
            <p> ${message}</p>
            <p>${email}</p>`,
        }

        try{
            await sendAnyEmail(options);

           res.status(200).json({
                status : 'success',
                message : 'Message sent successfully' 
            });

        }catch(e){
            res.status(500).json({message: e});
        }
    } 
)