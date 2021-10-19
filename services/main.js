const Transaction = require('../model/transaction');
const axios = require('axios')

class Services {

    constructor(obj,user){
        this.obj = obj,
        this.user = user
    }

    async createTransaction(){

        // create a transaction for that
        const transaction = await Transaction.create(this.obj);

        await transaction.save();
    }

    async debitWallet(toDebit){

        // if there is sufficient fund
        if(this.user.wallet[0].amount >= toDebit){

            this.user.wallet[0].amount -= toDebit;
            this.user.save({validateBeforeSave : false});

            //Set the amount and Create a debit transaction
            if(toDebit > 0){
                this.obj.amount = toDebit;
                await this.createTransaction();
            }
    
            return true;
        }

        return false;
    }

    async creditWallet(toCredit){

        if(toCredit >= 5){
            this.user.wallet[0].amount += toCredit;

            this.obj.amount = toCredit;
            await this.createTransaction();

            return true
        }

        return false;
    }

    async initiatePayStack(headers,data){

        let initTransaction = await axios({
            method : 'post',
            url : process.env.PAYSTACK_INIT_URL,
            data,
            headers
        });

        return initTransaction;
    }

    async verifyPayStack(headers,verifyURL){

        const verifyResponse = await axios({
            method : 'get',
            url : verifyURL,
            headers
        });

        return verifyResponse
    }
}

module.exports = Services;