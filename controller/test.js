const catchAsync = require('../utility/catchAsync');

exports.getTests = catchAsync(
    async (req,res,next)=> {

        res.status(200).json({
            status : 'success',
            message : 'If you can view this you have been granted access'
        })
    }
)