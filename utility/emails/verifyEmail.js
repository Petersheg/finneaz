const nodemailer = require('nodemailer');

const verifyEmail = async (options) => {

    const transport = nodemailer.createTransport({
        host : process.env.NODEMAILER_HOST,
        port : process.env.NODEMAILER_PORT,

        auth : {
            user: process.env.NODEMAILER_USER,
            pass : process.env.NODEMAILER_PASS,
        }

    })

    const mailOptions = {
        from : '<petersheg@gmail.com>',
        to : options.email,
        subject : options.subject,
        text : options.message
    }

    await transport.sendMail(mailOptions);
}

module.exports = verifyEmail