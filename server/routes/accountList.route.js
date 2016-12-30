const accountListController = require('../controllers/accountList.controller')
    , express = require('express')
    , router = express.Router();
//router -> /account
router.get('/',accountListController.renderAccountList);
router.get('/accountTable',accountListController.accountTable);     //账号列表获取
router.post('/modify',accountListController.modifyAccount);         //修改密码
router.post('/delete',accountListController.deleteAccount);         //删除账号

module.exports = router;
