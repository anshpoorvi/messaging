var express = require('express');
userController = require('../controllers/user/usercontroller');
var router = express.Router();

router.post('/unsecure_ethadd/1', function(req, res) {
  userController.validateEtherAddress(req, res);
});
router.post('/delete_it', function(req, res) {
  userController.deleteMessage(req, res);
});
router.post('/delete_send', function(req, res) {
  userController.deleteSend(req, res);
 });

router.get('/sendBoxPage', function(req, res) {
  userController.sendBoxPage(req, res);
});

router.get('/inboxPage', function(req, res) {
  userController.showInbox('',req, res);
});

router.get('/myMessages', function(req, res) {
  userController.showInbox('',req, res);
});
router.get('/logout', function(req, res) {
  userController.logout(req, res);
});
router.post('/sendMessage', function(req, res) {
  userController.sendMessage(req, res);
});

router.post('/markas_read', function(req, res) {
  userController.markAsRead(req, res);
});

router.post('/markas_unread', function(req, res) {
   userController.markAsUnRead(req, res);
});
router.post('/pagination', function(req, res) {
  userController.pagination(req, res);
  
});
router.get('/updateprofile', function(req, res) {
  userController.updateProfilePage(req, res);
  
});
router.post('/updateprofile', function(req, res) {
  userController.updateProfile(req, res);
});

router.get('/downloadFile/:id', function(req, res) {
  userController.downloadFile(req, res);
});
router.post('/saveToDraft', function(req, res) {
  userController.saveToDraft(req, res);
});
router.get('/draft/:ewa', function(req, res) {
  userController.getDraft(req, res);

});

module.exports = router;
