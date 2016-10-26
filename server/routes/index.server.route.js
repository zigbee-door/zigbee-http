var indexController = require('../controllers/index.server.controller');
var express = require('express');
var router = express.Router();

//home-主页
router.get('/',indexController.renderIndex);
module.exports = router;
