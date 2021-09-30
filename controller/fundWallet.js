const axios = require('axios')
const catchAsync = require('../utility/catchAsync');
const AppError = require('../utility/appError');
const Services = require('../services/main');

exports.fundWallet = catchAsync(

    async (req, res, next)=>{

        const currentUser = req.user;
        const userId = req.params.userId;

        if(currentUser._id != userId || !userId){
            return next(new AppError('Invalid User',400));
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
            amount : req.body.amount,
            email : currentUser.userEmail,
            first_name : currentUser.userFullName
        }

        try{

            let initTransaction = await service.initiatePayStack(headers,data);

            if(initTransaction.data.status){
                
                // Send checkOut uri t0 user;
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
                        const requestedAmount = verifyResponse.data.data.amount/100;
                        await service.creditWallet(requestedAmount );
                        currentUser.save({validateBeforeSave : false});

                    }else{
                        console.log("Payment is abandoned");
                    }
                }

            }

        }catch(err){
            console.log(err.message)
            return next(new AppError("Something went wrong, kindly try again",440));
        }
    }
)