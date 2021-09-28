const express = require('express');
const historyController = require('../controller/historyController');
const authUser = require('../controller/authController/users');

const router = express.Router({mergeParams : true});

router
.route('/')
.get(authUser.protect, historyController.getHistoryByUser);

module.exports = router;