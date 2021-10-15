const bcrypt = require('bcryptjs') ;
const crypto = require('crypto');

class MongoClass {

    async passwordCheck(plainPassword,hashedPassword){
        return await bcrypt.compare(plainPassword,hashedPassword);
    }

    // Method to check the time user changed their password
    passwordChangedAfterTokenIssued(JWT_iat){

        if(this.passwordChangedAt){
            //converting passwordChangedAt to timestamp
            const timeChange = parseInt(this.passwordChangedAt.getTime()/1000,10);
            return JWT_iat < timeChange;
        }

        return false;
    };

    // generate token for verification or password reset
    generateLinkToken(){
        
        const plainLinkToken = crypto.randomBytes(16).toString('hex');

        const hashedLinkToken = crypto.createHash('sha256').update(plainLinkToken).digest('hex');
        this.linkToken = hashedLinkToken;
        this.linkTokenExpires = Date.now() + 24 * 60 * 60 * 1000; //Expires After 24 hours

        return plainLinkToken;
    }
}

module.exports = MongoClass;