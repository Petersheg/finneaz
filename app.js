const express = require('express');
const app = express();
const userRoute = require('./router/user');
const testRoute = require('./router/test');
const globalErrorHandler = require('./controller/errorController/validation');
const AppError = require('./utility/appError');


app.use(express.json());

app.use('/api/v1/users',userRoute);
app.use('/api/v1/tests',testRoute);

// Handle unregister routes.
app.all('*',(req,res,next)=>{
    next(new AppError(`This route '${req.originalUrl}' is not registered on this network!`,440));
});

// Handle all global error
app.use(globalErrorHandler);

module.exports = app;