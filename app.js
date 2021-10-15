const express = require('express');
const helmet = require("helmet");
const xss = require('xss-clean');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const app = express();
const userRoute = require('./router/user');
const checkRoute = require('./router/check');
const webhookRoute = require('./router/webhook');
const resentEmailRoute = require('./router/resendEmail');
const globalErrorHandler = require('./controller/errorController/validation');
const AppError = require('./utility/appError');
const logger = require('./utility/logger');


app.use(express.json());

// Cors configuration
const whitelist = ['http://localhost:3000/','https://checkman.com'];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {

        logger.Report({
            service : 'app::corsOptions',
            message : 'Not allowed by CORS'
        })
        callback(new AppError('Not allowed by CORS',405))
    }
  }
}

// Enable cors on all routes
app.use(cors());

// To remove unwanted characters from the query:
app.use(mongoSanitize());
// Place security https header;
app.use(helmet());
// Prevent against xss attacks
app.use(xss());
// To make use cookieParser
app.use(cookieParser());

app.use('/api/v1/users',userRoute);
app.use('/api/v1/check',checkRoute);
app.use('/api/v1/resendemail',resentEmailRoute);
app.use('/api/v1/fundwallet/webhook',webhookRoute);


// Handle unregister routes.
app.all('*',(req,res,next)=>{
    next(new AppError(`This route '${req.originalUrl}' is not registered on this network!`,440));
});

// Handle all global error
app.use(globalErrorHandler);

module.exports = app;