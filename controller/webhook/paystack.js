const crypto = require('crypto');
const secret = process.env.PAYSTACK_SECRET_KEY;
const logger = require('../../utility/logger');
const User = require('../../model/userModel');
const Services = require('../../services/main');


exports.webhookURL = async (req,res)=>{
    //validate event
    const hash = crypto.createHmac('sha512', secret).update(JSON.stringify(req.body)).digest('hex');

    if (hash == req.headers['x-paystack-signature']) {

     // Retrieve the request's body
        let event = req.body;

     // Do something with event 
        const data = {

            reference : event.data.reference,
            email : event.data.customer.email,

            headers : {
                authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                'content-type': 'application/json'
            },

            transactionObject = {
                type : 'credit',
                status : 'successful',
                reason : 'fund wallet',
                user : currentUser.id
            }
        }
        const currentUser = await User.findOne({userEmail : data.email});
        
        const service = new Services(data.transactionObject,currentUser);
        let verifyResponse,verified;

        if (event.data.status === "success"){

            // VERIFY THE TRANSACTION BY MAKING A GET CALL
            const reference = data.reference;
            const verifyURL = process.env.PAYSTACK_VERIFY_URL.replace(':reference',reference);

            verifyResponse = await service.verifyPayStack(data.headers,verifyURL);

            verified = verifyResponse.data.status && verifyResponse.data.data.status === "success";

            // if( verified ){
            //     const requestedAmount = verifyResponse.data.data.amount/toBaseCurrency;
            //     await service.creditWallet(requestedAmount);
            //     currentUser.save({validateBeforeSave : false});

            // }else{

            //     logger.Report({
            //         service : 'controller::fundWallet',
            //         message : 'Payment is abandoned',
            //     })
            // }
        }

        console.log(verified);
        
        logger.Report({
            service : "controller::webhook::payStack",
            message : JSON.stringify(verifyResponse)
        })

    }
    res.send(200);
}