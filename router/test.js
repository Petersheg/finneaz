const express = require('express');
const testController = require('../controller/test');
const userAuth = require('../controller/authController/users');

const router = express.Router()

router.route('/').get(testController.getTests);

module.exports = router;