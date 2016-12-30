const loginController = require('../controllers/login.controller')
    , express = require('express')
    , router = express.Router();

//router -> /login or /
router.get('/',loginController.loginRender);
router.post('/',loginController.loginAuthen);   //登录认证
router.get('/logout',loginController.logout);   //注册
module.exports = router;
