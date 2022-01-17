const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendAnyEmail = async (options)=>{

    const msg = {
        from: 'uchechiajuruchi@gmail.com', //'info@checkman.vin',
        to: 'uchechiajuruchi@gmail.com',
        subject: options.subject,
        html: options.message,
    }
    
    await sgMail.send(msg);   
};

module.exports = sendAnyEmail;