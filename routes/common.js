var express = require('express'),
    commandata = require('../controllers/common/commoncontroller'),
    router = express.Router();

/* GET EWA */
router.get('/', function (req, res) {
    commandata.defaultPage(req, res);
});

/* About us */
router.get('/about', function (req, res) {
    commandata.about(req, res);
});

/* Register */
router.get('/register', function (req, res) {
    commandata.registerPage(req, res);
});

/* Login */
router.get('/login', function (req, res) {
    commandata.loginPage(req, res);
});

/* Forgot Password */
router.get('/forgotPassword', function (req, res) {
    commandata.restPage(req, res);
});

/* Policy Page*/
router.get('/policy', function (req, res) {
    commandata.policyPage(req, res);
});
/* Validate Login */
router.post('/validate_login', function(req, res) {
    commandata.validateLogin(req, res);
});
router.post('/register_user', function (req, res) {
    commandata.registerUser(req, res);
});
router.post('/forgot', function (req, res) {
    commandata.forgotUserPassword(req, res);
});

router.post('/reset', function (req, res) {
    commandata.restUserPassword(req, res);
});
router.get('/generateNewPassword/:email', function (req, res) {
    commandata.restByLink(req, res);
});

router.get('/bdaqverification/:email/:token', function (req, res) {
    commandata.bdaqVerification(req, res);
});

router.get('/resetpassword/:email/:token', function (req, res) {
    commandata.restByLink(req, res);
});
module.exports = router;
