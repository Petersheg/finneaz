const express = require('express');
const router = express.Router();
const webhookController = require('../controller/webhook/paystack');

router
.route('/')
.post(webhookController.webhookURL);

module.exports = router;