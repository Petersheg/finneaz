const nodemailer = require('nodemailer');

const sendEmail = async (options) => {

    const transport = nodemailer.createTransport({
        // host : process.env.NODEMAILER_HOST,
        // port : process.env.NODEMAILER_PORT,
        service:'gmail',
        auth : {
            user: 'petersheg@gmail.com', //process.env.NODEMAILER_USER,
            pass : 'peter0178' //process.env.NODEMAILER_PASS,
        }

    })

    const mailOptions = {
        from : options.email,
        to : 'petershegtrashbin@gmail.com',
        subject : options.subject,
        text : options.message
    }

    await transport.sendMail(mailOptions)
}

module.exports = sendEmail