const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path:'./config.env'});
const app = require('./app');

const connectURL = process.env.DB_LOCAL;
const port = process.env.PORT || 3000;
const connectATLAS = process.env.DB_ATLAS.replace('<PASSWORD>',process.env.DB_PASS);

const options = {
    useNewUrlParser : true,
    useUnifiedTopology: true
}

mongoose
.connect(connectATLAS,options)
.then(() => console.log('DB connected successfully'))
.catch(err =>  console.log(err));

app.listen(port,() => {
    console.log(`app running at port ${port}..`);
});