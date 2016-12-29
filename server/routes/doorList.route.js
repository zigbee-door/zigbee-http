const doorListController = require('../controllers/doorList.controller')
    , express = require('express')
    , router = express.Router();
//router -> /index
router.get('/',doorListController.renderDoorList);
router.get('/getList/:ip',doorListController.getDoorAssociateList);
// router.post('/setDoorNum',doorListController.setDoorNum);

module.exports = router;
