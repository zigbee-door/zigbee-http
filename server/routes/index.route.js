var indexController = require('../controllers/index.controller');
var express = require('express');
var router = express.Router();

//router -> /index
router.get('/',indexController.renderIndex);
module.exports = router;
