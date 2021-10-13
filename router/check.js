const express = require('express');
const checkController = require('../controller/checkController');
const authController = require('../controller/authController/users');
const userController = require('../controller/userController')
const router = express.Router();

// checkController.checkReportStatus
router
.route('/')
.get(authController.protect,checkController.checkReportStatus);

module.exports = router;
