const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const authController = require('./../controller/authController/users');

router.post('/signup',authController.signup);
router.get('/verifyemail/:linkToken', authController.verifyEmail);
router.post('/login',authController.login);
router.post('/forgotpassword',authController.forgotPassword);

router
.route('/')
.get(userController.getUsers);

module.exports = router;