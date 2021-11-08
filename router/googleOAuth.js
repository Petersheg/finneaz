const express = require('express');
const googleCon = require('../controller/authController/google');

const router  = express.Router();

router.route('/').post(googleCon.googleOAuth2);
module.exports = router;