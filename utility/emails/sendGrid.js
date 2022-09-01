const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const AppError = require('../appError');

const sendAnyEmail = async (options)=>{
    try{
        const msg = {
            from: process.env.SENDGRID_SENDER, //'info@checkman.vin',
            to: options.email,
            subject: options.subject,
            html: options.message,
        }
        
        await sgMail.send(msg);

    }catch(e){
        console.log(e.message);
        return next(new AppError('something went wrong, try later',500));
    }
   
};

module.exports = sendAnyEmail;