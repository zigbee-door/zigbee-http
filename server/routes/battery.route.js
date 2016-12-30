const batteryController = require('../controllers/battery.controller')
    , express = require('express')
    , router = express.Router();

//router -> /battery
router.get('/',batteryController.renderBattery);
module.exports = router;