const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path:'./config.env'});
const app = require('./app');

// let connectURL;
// if(process.env.NODE_ENV === "production"){
//     connectURL = process.env.DB_ATLAS.replace('<PASSWORD>',process.env.DB_PASS);
// }else{
//     connectURL = process.env.DB_LOCAL;
// }
const port = process.env.PORT || 3000;

// const options = {
//     useNewUrlParser : true,
//     useUnifiedTopology: true
// }

// mongoose
// .connect(connectURL,options)
// .then(() => console.log('DB connected successfully'))
// .catch(err => console.log(err));

app.listen(port,() => {
    console.log(`app running at port ${port}..`);
});