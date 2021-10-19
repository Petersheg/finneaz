const catchAsync = require('../utility/catchAsync');
const AppError = require('../utility/appError');
const axios = require('axios')

exports.checkAvailability = catchAsync(

    async (req,res, next)=>{
        const VIN = req.query.vin;
        
        if(!VIN){
            return next(new AppError("You must provide a VIN",402));
        }
        
        const checkURL = 
        `${process.env.CARFAX_BASE_URL}/check?key=${process.env.CARFAX_KEY}&vin=${VIN}&type=carfax`;

        
        // call to get the report availability
        const checkStatus = await axios({
            method : 'get',
            url : checkURL
        })

        let reportIsAvailable = checkStatus.data.status;

        if(!reportIsAvailable){
            return next(new AppError("Report not available for provided VIN"))
        }

        if(reportIsAvailable){
            res.status(200).json({
                status : "success",
                message : "Report is available!"
            })
        }
    }
);