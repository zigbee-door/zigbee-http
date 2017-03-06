const tenantController = require('../controllers/tenant.controller')
    , express = require('express')
    , router = express.Router();

router.get('/',tenantController.renderTenant);
router.get('/list',tenantController.renderTenantList);
module.exports = router;
