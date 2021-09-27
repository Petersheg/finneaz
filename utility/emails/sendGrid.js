const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendAnyEmail = (options)=>{

    const msg = {
        from: 'checkman@gmail.com', 
        to: options.email,
        subject: options.subject,
        html: options.message,
    }

    sgMail.send(msg).then((res)=>{
        console.log(res)
    }).catch((err)=>{
        console.log(err);
    })
}

module.exports = sendAnyEmail;