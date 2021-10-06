const express = require('express');
const resentEmailCon = require('../controller/resentEmail');

const router = express.Router();

router.route("/").post(resentEmailCon.resentEmail);

module.exports = router;