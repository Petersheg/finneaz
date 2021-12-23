const express = require('express');
const {contact} = require('../controller/contact');

const router = express.Router();

router.post('/contact',contact);

module.exports = router;