const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path:'./config.env'});
const app = require('./app');
const logger = require('./utility/logger');

const connectURL = process.env.DB_LOCAL;
const port = process.env.PORT || 3000;
const connectATLAS = process.env.DB_ATLAS.replace('<PASSWORD>',process.env.DB_PASS);

const options = {
    useNewUrlParser : true,
    useUnifiedTopology: true
}

mongoose
.connect(connectURL,options)
.then(() => console.log('DB connected successfully'))
.catch(err =>  logger.Report({ 
    service : "server::mongoose",
    message : err
}));

app.listen(port,() => {
    console.log(`app running at port ${port}..`);
});