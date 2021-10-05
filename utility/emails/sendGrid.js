const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendAnyEmail = async (options)=>{

    const msg = {
        from: 'admin@mad9aija.com', 
        to: options.email,
        subject: options.subject,
        html: options.message,
    }

    try{
        const res = await sgMail.send(msg);
        console.log(res);
    }catch(err){
        console.log(err.message)
    }
    // sgMail.send(msg).then((res)=>{
    //     console.log(res)
    // }).catch((err)=>{
    //     console.log(err);
    // })
};

module.exports = sendAnyEmail;