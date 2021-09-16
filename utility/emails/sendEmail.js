const nodemailer = require('nodemailer');

const sendEmail = async (options) => {

    const transport = nodemailer.createTransport({
        host : process.env.NODEMAILER_HOST,
        port : process.env.NODEMAILER_PORT,

        auth : {
            user: process.env.NODEMAILER_USER,
            pass : process.env.NODEMAILER_PASS,
        }

    })

    const mailOptions = {
        from : '<checkmang@gmail.com>',
        to : options.email,
        subject : options.subject,
        html : options.message
    }

    await transport.sendMail(mailOptions);
}

module.exports = sendEmail