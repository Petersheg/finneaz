const express = require('express');
const authUser = require('../controller/authController/users');
const fundWalletController = require('../controller/fundWallet');

const router = express.Router({mergeParams : true});

router.route('/').get(authUser.protect, fundWalletController.fundWallet);

module.exports = router;