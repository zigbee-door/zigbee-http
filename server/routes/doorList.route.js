const doorListController = require('../controllers/doorList.controller')
    , express = require('express')
    , router = express.Router();
//router -> /doorList
router.get('/',doorListController.renderDoorList);
router.get('/getList/:ip',doorListController.getDoorAssociateList); //获取基站关联列表
// router.post('/setDoorNum',doorListController.setDoorNum);

module.exports = router;
