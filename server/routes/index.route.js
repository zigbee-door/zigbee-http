const indexController = require('../controllers/index.controller')
    , express = require('express')
    , router = express.Router();
//router -> /index
router.get('/',indexController.renderIndex);
router.get('/baseTable',indexController.baseTable); //获取基站状态信息
module.exports = router;
