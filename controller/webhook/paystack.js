const crypto = require('crypto');
const secret = process.env.PAYSTACK_SECRET_KEY;
const logger = require('../../utility/logger');


exports.webhookURL = (req,res)=>{
    //validate event
    const hash = crypto.createHmac('sha512', secret).update(JSON.stringify(req.body)).digest('hex');
    let event;

    if (hash == req.headers['x-paystack-signature']) {
     // Retrieve the request's body
        event = req.body;
     // Do something with event 
     const data = {
        reference : event.data.reference,
        email : event.data.customer.email
     }
     
     
        logger.Report({
            service : "controller::webhook::payStack",
            message : JSON.stringify(data)
        })


        // if (event.data.status === "success"){

        //     // VERIFY THE TRANSACTION BY MAKING A GET CALL
        //     const reference = event.data.reference;
        //     const verifyURL = process.env.PAYSTACK_VERIFY_URL.replace(':reference',reference);

        //     const verifyResponse = await service.verifyPayStack(headers,verifyURL);
        //     let verified = verifyResponse.data.status && verifyResponse.data.data.status === "success";

        //     if( verified ){
        //         const requestedAmount = verifyResponse.data.data.amount/toBaseCurrency;
        //         await service.creditWallet(requestedAmount);
        //         currentUser.save({validateBeforeSave : false});

        //     }else{

        //         logger.Report({
        //             service : 'controller::fundWallet',
        //             message : 'Payment is abandoned',
        //         })
        //     }
        // }

    }
    res.send(200);
}