const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs') ;
const walletSchema = require('./wallet');
const MongoClass = require('../utility/mongoMethods');

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
        required : [true, 'Email Address is required'],
        validate : [validator.isEmail,'Kindly provide a valid email address'] //To validate Email
    },

    emailConfirmationStatus : {
        type : Boolean,
        default : false
    },

    password :  {
        type: String,
        required : [true,'Password is required'],
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

    passwordChangedAt : {
        type : Date
    },

    wallet : [walletSchema],

    linkToken : String,
    linkTokenExpires : Date
});

// Hash Password and make it available on instance method.
userSchema.pre('save', async function(next){
    // if password is not modified then return & do not hash
    if(!this.isModified('password')) return next();

    // else hash password
    this.password = await bcrypt.hash(this.password,12);
    this.confirmPassword = undefined; //Get rid of confirm password.
});

userSchema.pre('save', function(next){
    if(!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 2000;
    next();
})

// Help create wallet for user during sign up.
userSchema.pre('save', async function(next){

    if(this.isNew){
        this.wallet.push({amount : 0, dateCreated : Date.now()});
    }
    next();
});

userSchema.loadClass(MongoClass);

// delete unwanted model properties
userSchema.set('toJSON', {
    transform: (_, returnedObject) => {
      returnedObject.id = returnedObject._id.toString();
      delete returnedObject._id;
      delete returnedObject.__v;
      delete returnedObject.password;
    },
});

const User = mongoose.model('User',userSchema);

module.exports = User;