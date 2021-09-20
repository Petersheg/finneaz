const mongoose = require('mongoose');

// Create wallet schema
const walletSchema = new mongoose.Schema({
    amount : { 
        type : Number,
        default : 0
    },

    dateCreated : {
        type : Date,
        default : Date.now()
    },

    transactions :{
        type : Array,
    }
});

const Wallet = mongoose.model('Wallet', walletSchema);
module.exports = walletSchema;