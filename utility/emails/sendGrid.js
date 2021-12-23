const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendAnyEmail = async (options)=>{

    const msg = {
        from: 'petersheg@gmail.com', //'info@checkman.vin',
        to: 'opeter511@stu.ui.edu.ng',
        subject: options.subject,
        html: options.message,
    }
    
    await sgMail.send(msg);   
};

module.exports = sendAnyEmail;