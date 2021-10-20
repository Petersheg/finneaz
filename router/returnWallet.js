const express = require('express');
const authController = require('../controller/authController/users');
const walletController = require('../controller/walletController');

const router = express.Router({mergeParams : true});
router.route('/').get(authController.protect,walletController.returnWallet);

module.exports = router;