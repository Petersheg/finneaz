const dotenv = require('dotenv');
dotenv.config({path:'../config.env'});

exports.config = {

    // APP
    PORT : process.env.PORT,
    NODE_ENV : process.env.NODE_ENV,
    JWT_SECRET : process.env.JWT_SECRET,
    JWT_EXPIRED_AFTER : process.env.JWT_EXPIRED_AFTER,

    // DATABASE
    DB_LOCAL : process.env.DB_LOCAL || 3000,
    DB_ATLAS : process.env.DB_ATLAS,
    DB_PASS : process.env.DB_PASS,

    // CAR FAX
    CARFAX_BASE_URL : process.env.CARFAX_BASE_URL,
    CARFAX_KEY : process.env.CARFAX_KEY,
    CARFAX_VIN : process.env.CARFAX_VIN,

    // SEND GRID
    SENDGRID_API_KEY : process.env.SENDGRID_API_KEY,

    // PAY STACK
    PAYSTACK_INIT_URL : process.env.PAYSTACK_INIT_URL,
    PAYSTACK_VERIFY_URL : process.env.PAYSTACK_VERIFY_URL,
    PAYSTACK_SECRET_KEY : process.env.PAYSTACK_SECRET_KEY,

    // SLACK
    SLACK_WEBHOOK_URL : process.env.SLACK_WEBHOOK_URL,

    
}