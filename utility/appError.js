// const logger = require('./logger');
class AppError extends Error{
    constructor(message,statusCode,service = 'General::controller::logger'){
        super(message);
        this.statusCode = statusCode;
        this.status = `${this.statusCode}`.startsWith('4') ? 'fail' : 'error'

        this.isOperational = true;

        Error.captureStackTrace(this,this.constructor);

    }
}

module.exports = AppError;