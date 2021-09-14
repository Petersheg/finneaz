const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs') ;

const userSchema = new mongoose.Schema({

    userFullName : {
        type : String,
        required : [true, 'Name is required'],
        maxLength : [255, 'Name is too long'],
    },

    userName :{
        type : String,
        unique : true,
        required : [true, 'User Name is required'],
    },

    userMobile :{
        type: Number,
        required : [true, 'Mobile Number is required'],
        min : [11, 'Phone number must have at least 11 digits'],
        // validate :[validator.isMobile,'This is a wrong phone number format']
    },

    userEmail : {
        type : String,
        unique : true,
        required : [true, 'User Email is required'],
        validate : [validator.isEmail,'Kindly provide a valid email address'] //To validate Email
    },

    emailConfirmation : {
        type : String,
        default : 'Pending'
    },

    password :  {
        type: String,
        required : true,
        minLength : [8,'Password should have at least 8 characters'],
        select : false
    },

    confirmPassword : {
        type : String,
        required : [true, 'Kindly confirm your password'],
        // check if confirm password is equal to the password
        validate : {
            validator : function(password) { return password === this.password},
            message : 'Confirm password must be the same as your password'
        }
    },
});

// Hash Password and make it available on instance method.
userSchema.pre('save', async function(next){
    // if password is not modified then return & do not hash
    if(!this.isModified('password')) return next();

    // else hash password
    this.password = await bcrypt.hash(this.password,12);
    this.confirmPassword = undefined; //Get rid of confirm password.
});

userSchema.methods.passwordCheck = async function (plainPassword,hashedPassword){

    return await bcrypt.compare(plainPassword,hashedPassword);
};

// generate token for user authentication.


const User = mongoose.model('User',userSchema);

module.exports = User;