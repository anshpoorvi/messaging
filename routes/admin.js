var express = require('express'),
admincontroller = require('../controllers/admin/admincontroller'),
airdrop = require('../controllers/admin/airdrop'),
router = express.Router();

/* GET users listing. */
router.get('/', function (req, res) {
    admincontroller.defaultPage(req, res);
});

router.get('/adminInbox', function (req, res) {
    admincontroller.adminInboxPage(req, res);
});
router.get('/showReport', function (req, res) {
    admincontroller.adminReportPage(req, res);
});
router.get('/alluser', function (req, res) {
    admincontroller.adminAllUserPage(req, res);
});
router.post('/findUser', function (req, res) {
    admincontroller.findUser(req, res);
});

router.get('/createExcel', function (req, res) {
    admincontroller.createExcelFile(req, res);
    
});
//Genarate Csv
router.get('/generateCsv', function (req, res) {
    admincontroller.exportIncompleteUser(req, res); 
});
router.post('/bulkSend', function(req, res) {
    admincontroller.bulkSend(req, res);
});

router.post('/blockuser', function(req, res) {
    admincontroller.blockUser(req, res);
});
router.post('/unBlockUser', function(req, res) {
    admincontroller.unBlockUser(req, res);
});

router.post('/searchRegistered', function(req, res) {
    admincontroller.searchRegistered(req, res);
});
router.post('/changePassword', function(req, res) {
    admincontroller.changePassword(req, res);
});

router.post('/logOut', function(req, res) {
    admincontroller.logOutUser(req, res);
});

router.get('/logoutadmin', function(req, res) {
    admincontroller.logOutAdmin(req, res);
});
router.post('/airdrop', function(req, res) {
     airdrop.airdrop(req, res);
});
router.get('/changeMessageStatus/:status/:id', function(req, res) {
    admincontroller.changeMessageStatus(req, res);
 });
 router.post('/sendAdminMessage', function (req, res) {
    admincontroller.sendAdminMessage(req, res);
 });
 
 router.post('/nextPage', function (req, res) {
    admincontroller.allUserPagination(req, res);
 });
 router.get('/blockchain', function (req, res) {
   
    admincontroller.getAssetRegistry(req, res);
 });
 router.get('/restTransaction', function (req, res) {
    admincontroller.blockChainView(req, res); 
 });
 router.get('/historian', function (req, res) {
    admincontroller.blockChain(req, res);
 });
 router.get('/:start/:limit', function (req, res) {
    admincontroller.paging(req, res);
 });
module.exports = router;
