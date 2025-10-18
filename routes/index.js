const { Router } = require("express");
const adminCtl = require('../controllers');
const router = Router();

router.get('/',adminCtl.homePage);
router.get('/form-basic',adminCtl.formBasicPage)
router.get('/tables',adminCtl.tablePage)
router.get('/authentication-login',adminCtl.authenticationLoginPage)
router.get('/authentication-register',adminCtl.authenticationRegisterPage)


module.exports = router;