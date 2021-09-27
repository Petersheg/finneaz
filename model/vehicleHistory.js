const mongoose = require('mongoose');

// create mongoose schema
const vehicleSchema = new mongoose.Schema({

    vin : {
        type : String,
        unique : [true, 'VIN already exit in the database'],
        required : [true, 'VIN is required']
    },

    users : [
        {
            type : mongoose.Schema.ObjectId,
            ref : 'User'
        }
    ],

    timeStamp : {
        type : Date,
        default : Date.now()
    }
})

const History = mongoose.model('History', vehicleSchema);

module.exports = History;