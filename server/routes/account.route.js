const accountController = require('../controllers/account.controller')
    , express = require('express')
    , router = express.Router();
//router -> /account
router.get('/',accountController.renderAccount);
// router.get('/getList/:ip',doorListController.getDoorAssociateList);
router.post('/register',accountController.registerAccount);   //账号注册请求

module.exports = router;
