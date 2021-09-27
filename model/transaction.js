const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({

    type : {
        type : String,
        enum : ['credit','debit'],
        required : [true, 'transaction must have a type'],
    },

    status : {
        type : String,
        enum : ['fail', 'successful', 'pending'],
        require : true
    },

    amount : {
        type : Number,
        required : true
    },

    reason : {
        type : String,
    },

    dateInitiated : {
        type : Date,
        default : Date.now()
    },

    // Parent referencing
    user : {
        type : mongoose.Schema.ObjectId,
        ref : 'User'
    }

},{
    toJSON : {virtuals : true},
    toObject : {virtuals : true}
});

const Transaction  = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;