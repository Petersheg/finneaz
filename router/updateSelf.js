const express = require("express");
const authController = require('./../controller/authController/users');

const router = express.Router({mergeParams : true});

router.route("/").patch(authController.protect,authController.updateSelf);

module.exports = router;