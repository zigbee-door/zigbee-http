var indexController = require('../controllers/index.controller');
var express = require('express');
var router = express.Router();

//router -> /index
router.get('/',indexController.renderIndex);
router.get('/baseTable',indexController.baseTable);
module.exports = router;
