const doorListController = require('../controllers/doorList.controller')
    , express = require('express')
    , router = express.Router();
//router -> /index
router.get('/',doorListController.renderDoorList);
router.get('/',doorListController.getDoorAssociateList);
module.exports = router;