const accountListController = require('../controllers/accountList.controller')
    , express = require('express')
    , router = express.Router();
//router -> /account
router.get('/',accountListController.renderAccountList);
router.get('/accountTable',accountListController.accountTable);     //账号列表获取
// router.post('/register',accountController.registerAccount);   //账号注册请求

module.exports = router;
