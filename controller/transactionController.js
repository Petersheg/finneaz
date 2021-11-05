const catchAsync = require('../utility/catchAsync');
const AppError = require('../utility/appError');
const Transaction = require('../model/transaction');
let _ = require('lodash');

exports.getTransactionByUser = catchAsync(

    async (req,res,next) => {
 
        let filter = {};

        let userId = req.params.userId;
        const currentUserId = req.user._id;

        if(userId != currentUserId){
            return next(new AppError('Invalid user',401));
        }

        if(!userId){
            return next(new AppError('You can not access this route',403));
        }

        if(userId  || req.query){
            filter = {user : userId, ...req.query};
        }
        let newFilter = _.omit(filter,["page","limit"]);
       
        let transaction = Transaction.find(newFilter);

        // Implement Pagination
        const pages = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 3;
        const skip = (pages - 1) * limit;

        transaction = transaction.skip(skip).limit(limit);

        const transactions = await transaction;

        if(!transactions || transactions.length === 0){
            return next(new AppError('Transaction(s) not available',404));
        }
        
        res.status(200).json({
            status: "success",
            data: {
                transactions
            }
        });
    }
)