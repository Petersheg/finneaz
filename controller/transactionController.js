const catchAsync = require('../utility/catchAsync');
const AppError = require('../utility/appError');
const Transaction = require('../model/transaction');

exports.getTransactionByUser = catchAsync(

    async (req,res,next) => {
 
        let filter = {};
        let userId = req.params.userId;

        if(typeof userId !== 'undefined' || req.query) filter = {user:req.params.userId,...req.query};
        if(typeof userId === 'undefined' || req.query) filter = {...req.query};

        console.log(filter);

        const transactions = await Transaction.find(filter);
        
        res.status(200).json({
            status: true,
            transactions
        });
    }
)