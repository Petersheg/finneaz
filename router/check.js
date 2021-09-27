const express = require('express');
const checkController = require('../controller/checkController');
const authController = require('../controller/authController/users');
const router = express.Router();

router
.route('/')
.get(authController.protect, checkController.checkReportStatus);

module.exports = router;
