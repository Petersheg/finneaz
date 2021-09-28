const catchAsync = require('../utility/catchAsync');
const AppError = require('../utility/appError');
const Transaction = require('../model/transaction');

exports.getTransactionByUser = catchAsync(

    async (req,res,next) => {
 
        let filter = {};
        let userId = req.params.userId;

        if(!userId){
            return next(new AppError('You can not access this route',409));
        }

        if(userId  || req.query){
            filter = {user : userId, ...req.query};
        } 

        console.log(filter);

        const transactions = await Transaction.find(filter);

        if(!transactions || transactions.length === 0){
            return next(new AppError('No transaction(s) for this user',404));
        }
        
        res.status(200).json({
            status: true,
            transactions
        });
    }
)