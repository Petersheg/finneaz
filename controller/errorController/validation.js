const AppError = require('./../../utility/appError');

const handleDuplicateKey = (err)=>{
    //const value = /"(.*?)"/g.exec(err.message); //Match word within quotes
    const value = Object.values(err.keyValue);
    const message = `${value[0]} already exist in the database`;
    return new AppError(message,400);
}

const handleRequiredField = (err) =>{
    let message =  Object.values(err.errors).map(el => el.message).join(', ');
    return new AppError(message,400);
}

const handleUnregisteredRoute = (err)=>{
    const message = err.message;
    return new AppError(message,440);
}

const handleCastError = (err)=>{
    const value = /".*?"/g.exec(err.message);
    let message = `${value} is a wrong input type for the field specified for`;
    return new AppError(message,440);
}

const productionError = (err,res) => {

    if(err.isOperational){

        res.status(err.statusCode).json({
            status : err.status,
            message : err.message
        });

    }else{
        console.log('Error', err.errors);

        res.status(500).json({
            status : 'fail',
            message : 'Implementation Error'
        });
    }

}

const developmentError = (err,res)=>{
    res.status(err.statusCode).json({
        status : err.statusCode,
        message : err.message,
        error : err
    })
}

module.exports = (err,req,res,next)=>{

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'fail';
    
    console.log(err);

    if(process.env.NODE_ENV === 'development'){
        console.log(err.message)
        developmentError(err,res)
    }

    if(process.env.NODE_ENV === 'production'){

        if(err.code === 11000){
            err = handleDuplicateKey(err);
        }

        if(err.message.includes('Cast')){
           err = handleCastError(err);
        }

        if(err.message.includes('validation')){
            err = handleRequiredField(err);
        }else{
            err = handleUnregisteredRoute(err);
        }

        productionError(err,res);
    }
}