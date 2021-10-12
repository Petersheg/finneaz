const axios = require('axios')
const catchAsync = require('../utility/catchAsync');
const AppError = require('../utility/appError');
const Services = require('../services/main');
const logger = require('../utility/logger');

exports.fundWallet = catchAsync(

    async (req, res, next)=>{

        const currentUser = req.user;
        const userId = req.params.userId;
        const toBaseCurrency = 100;

        if(currentUser._id != userId || !userId){
            return next(new AppError('Invalid User',404));
        }

        if(!userId){
            return next(new AppError('You can not access this route'));
        }

        const transactionObject = {
            type : 'credit',
            status : 'successful',
            reason : 'fund wallet',
            user : currentUser._id
        }
        
        const service = new Services(transactionObject,currentUser)

        let headers = {
            authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            'content-type': 'application/json'
        }

        let data = {
            amount : req.body.amount * toBaseCurrency,
            email : currentUser.userEmail
        }

        try{

            let initTransaction = await service.initiatePayStack(headers,data);

            if(initTransaction.data.status){
                
                // Send checkOut ur t0 user;
                const checkOutURL = initTransaction.data.data.authorization_url;

                res.status(200).json({
                    status : true,
                    checkOutURL
                })
                
                const reference = initTransaction.data.data.reference;

                if (checkOutURL){

                    // VERIFY THE TRANSACTION BY MAKING A GET CALL
                    const verifyURL = process.env.PAYSTACK_VERIFY_URL.replace(':reference',reference);

                    const verifyResponse = await service.verifyPayStack(headers,verifyURL);
                    let verified = verifyResponse.data.status //&& verifyResponse.data.data.status === "success";

                    if( verified ){
                        const requestedAmount = verifyResponse.data.data.amount/toBaseCurrency;
                        await service.creditWallet(requestedAmount);
                        currentUser.save({validateBeforeSave : false});

                    }else{

                        logger.Report({
                            service : 'controller::fundWallet::fundWallet',
                            message : 'Payment is abandoned',
                        })
                    }
                }

            }

        }catch(err){

            logger.Report({
                service : 'controller::fundWallet',
                message : JSON.stringify(err.response.data.message),
            });

            return next(new AppError(err.response.data.message,500));
        }
    }
)