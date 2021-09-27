const express = require('express');
const transactionHandler = require('../controller/transactionController');
const authController = require('../controller/authController/users')

const router = express.Router({mergeParams : true});

router.route('/').get(authController.protect, transactionHandler.getTransactionByUser)

module.exports = router;