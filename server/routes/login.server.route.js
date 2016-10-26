var loginController = require('../controllers/login.server.controller');
var express = require('express');
var router = express.Router();

//login-登录
router.get('/',loginController.renderLogin);
module.exports = router;
