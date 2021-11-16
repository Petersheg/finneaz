const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendAnyEmail = async (options)=>{

    const msg = {
        from: 'info@checkman.vin',
        to: options.email,
        subject: options.subject,
        html: options.message,
    }
    
    await sgMail.send(msg);   
};

module.exports = sendAnyEmail;