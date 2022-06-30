const router = require("express").Router();
const { body } = require("express-validator");
/* pages route */
const {
		activeVendors,
		suspendedVendors,
		activeCustumers,
		suspendedCustumers,
		activeDeliverer,
		suspendedDeliverer,
        createvendor,
        createdelivery,
        updatevendor,
        profile,
        deactivate_vendor,
        activate_vendor,
        deactivate_cust,
        activate_cust,
        deactivate_del,
        activate_del,
        deposit,
        adminImport,
        updatevendorpage,
        createvendorpage,
        moneydeposit,
        vreport,
        creport,
        dreport,
        vexport,
        cexport,
        dexport,
        oexport,
        vimport,
        cimport,
        oimport,
        sactiveVendors,
        vreportpdf
		} = require("../controllers/adminController");


const {isLoggedin, isNotLoggedin} = require('../lib/check_authentication');
const validator = require('../lib/validation_rules_admin');
router.get('/admin/index',isLoggedin,activeVendors);
router.get('/admin/svendors',isLoggedin,suspendedVendors);
router.get('/admin/acustomers',isLoggedin,activeCustumers);
router.get('/admin/adelivery',isLoggedin,activeDeliverer);
router.get('/admin/vcreate',isLoggedin,createvendorpage);
router.post('/admin/vcreater',isLoggedin,validator.validationRules[0],createvendor);
router.get('/admin/dcreate',isLoggedin,createdelivery);
router.post('/admin/dcreate',isLoggedin,validator.validationRules[1],createdelivery);
router.post('/admin/deposit',isLoggedin,deposit);
router.get('/admin/edit',isLoggedin,profile);
router.post('/admin/edit_vendor',isLoggedin,updatevendorpage);
router.post('/admin/editing_vendor',isLoggedin,updatevendor);
router.get('/admin/import',isLoggedin,adminImport);
router.get('/admin/scustomers',isLoggedin,suspendedCustumers);
router.get('/admin/sdelivery',isLoggedin,suspendedDeliverer);
router.post('/admin/cdeactivate',isLoggedin,deactivate_cust);
router.post('/admin/cactivate',isLoggedin,activate_cust);
router.post('/admin/vdeactivate',isLoggedin,deactivate_vendor);
router.post('/admin/vactivate',isLoggedin,activate_vendor);
router.post('/admin/ddeactivate',isLoggedin,deactivate_del);
router.post('/admin/dactivate',isLoggedin,activate_del);
router.post('/admin/deposit_mny',isLoggedin,moneydeposit);

router.post('/admin/report/vendor',isLoggedin,vreport);
router.post('/admin/report/customer',isLoggedin,creport);
router.post('/admin/report/delivery',isLoggedin,dreport);
router.post('/admin/export/vendor',isLoggedin,vexport);
router.post('/admin/export/customer',isLoggedin,cexport);
router.post('/admin/export/order',isLoggedin,oexport);
router.post('/admin/export/deposit',isLoggedin,dexport);

router.post('/admin/import/vendor',isLoggedin,vimport);
router.post('/admin/import/customer',isLoggedin,cimport);
router.post('/admin/import/order',isLoggedin,oimport);

router.post('/admin/search/index',isLoggedin,sactiveVendors);







// router.get('/', isLoggedin, homePage);
// router.post('/', isLoggedin, homePage);

// router.get("/auth/login", isNotLoggedin, loginPage);
// router.post("/auth/login", isNotLoggedin, validator.validationRules[0], login);

// router.get("/auth/signup", isNotLoggedin, registerPage);
// router.post("/auth/signup", isNotLoggedin, validator.validationRules[1], register);

// router.get('/logout', 
// 		(req, res, next) => {
// 				req.session.destroy(
// 						(err) => {
// 							next(err);
// 							}
// 					);
// 		res.redirect('/auth/login');
// 	}
// );

// router.get("/auth/passReset_Request", isNotLoggedin, forgotPassword);
// router.post("/auth/passReset_Request", isNotLoggedin, sendResetPassLink);

// router.get("/reset-password", isNotLoggedin, resetPasswordPage);
// router.post("/reset-password", isNotLoggedin, validator.validationRules[3], resetPassword);

module.exports = router;