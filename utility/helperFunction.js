const jwt = require('jsonwebtoken');

exports.generateJWToken = (id) => {

    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn : process.env.JWT_EXPIRED_AFTER
    });
};

exports.sendTokenAsResponse = (statusCode,user,res) =>{
    const userId = user._id;
    
    const token = jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn : process.env.JWT_EXPIRED_AFTER
    }) 
    
    res.cookie('token',token,{maxAge:24 * 60 * 60 * 1000}); //Expires After 24 hours

    res.status(statusCode).json({
        status : 'success',
        token,
        data : {
            user
        }
    })
}