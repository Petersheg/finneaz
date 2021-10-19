const express = require('express');
const availabilityCon = require('../controller/reportAvailability');
const authController = require('../controller/authController/users');
const router = express.Router();

// checkController.checkReportStatus
router
.route('/')
.get(authController.protect,availabilityCon.checkAvailability);

module.exports = router;
