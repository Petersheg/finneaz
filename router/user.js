const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const authController = require('./../controller/authController/users');

router.get('/verifyemail/:linkToken', authController.verifyEmail);
router.post('/signup',authController.signup);
router.post('/login',authController.login);

router
.route('/')
.get(userController.getUsers);

module.exports = router;