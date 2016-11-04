var loginController = require('../controllers/login.controller');
var express = require('express');
var router = express.Router();

//router -> /login or /
router.get('/',loginController.loginRender);
router.post('/',loginController.loginAuthen);
router.get('/logout',loginController.logout);
module.exports = router;
