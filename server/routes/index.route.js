const indexController = require('../controllers/index.controller')
    , express = require('express')
    , router = express.Router();
//router -> /index
router.get('/',indexController.renderIndex);
router.get('/baseTable/:ip',indexController.getAsso);
module.exports = router;
