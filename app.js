const express = require('express');
const helmet = require("helmet");
const xss = require('xss-clean');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const app = express();
const userRoute = require('./router/user');
const checkRoute = require('./router/check');
const globalErrorHandler = require('./controller/errorController/validation');
const AppError = require('./utility/appError');


app.use(express.json());

// To remove unwanted characters from the query:
app.use(mongoSanitize());
// Place security https header;
app.use(helmet());
// Prevent against xss attacks
app.use(xss());
// Enable cors on all routes
app.use(cors());
// To make use cookieParser
app.use(cookieParser());

app.use('/api/v1/users',userRoute);
app.use('/api/v1/check',checkRoute);



// Handle unregister routes.
app.all('*',(req,res,next)=>{
    next(new AppError(`This route '${req.originalUrl}' is not registered on this network!`,440));
});

// Handle all global error
app.use(globalErrorHandler);

module.exports = app;