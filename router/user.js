const express = require('express');
const userController = require('../controller/userController');
const authController = require('./../controller/authController/users');
const transactionRoute = require('./transaction');
const historyRoute = require('./history');
const fundWalletRoute = require('./fundWallet');

const router = express.Router();

router.use('/:userId?/history', historyRoute);
router.use('/:userId?/transactions', transactionRoute);
router.use('/:userId?/fundwallet',fundWalletRoute);

router.post('/signup',authController.signup);
router.get('/verifyemail/:linkToken', authController.verifyEmail);
router.post('/login',authController.login);
router.post('/forgotpassword',authController.forgotPassword);
router.patch('/resetpassword/:resetToken',authController.resetPassword);
router.patch('/updatepassword',authController.protect,authController.updatePassword);

router
.route('/')
.get(userController.getUsers);

module.exports = router;