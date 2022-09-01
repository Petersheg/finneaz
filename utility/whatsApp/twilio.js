// let accountSid = process.env.TWILIO_ACCOUNT_ID; // Your Account SID from www.twilio.com/console
// let authToken = process.env.TWILIO_AUTH_TOKEN;   // Your Auth Token from www.twilio.com/console

// const client = require('twilio')(accountSid, authToken);


// exports.sentToWhatsApp = async(message)=> {
//     client.messages 
//       .create({ 
//          body: message, 
//          from: 'whatsapp:+14155238886',       
//          to: 'whatsapp:+2348132665626' 
//        }) 
//       .then(message => console.log(message.sid)) 
//       .done();
// }