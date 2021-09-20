const User = require('../model/userModel');

exports.getUsers = async (req,res)=>{
    
    try{
        const allUser = await User.find();

        res.status(200).json({
            result : allUser.length,
            data: {
                users : allUser
            }
        });

    }catch(err){

        res.status(405).json({
            status : 'fail',
            message : err
        });
    }
};