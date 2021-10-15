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
        logger.Report({
            service : "controller::webhook::payStack",
            message : JSON.stringify(event)
        })



    }
    res.send(200);
}