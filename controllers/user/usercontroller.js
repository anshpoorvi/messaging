var usermodel = require('../../models/user/usermodel'),
    ethereum_address = require('ethereum-address');
var crypto = require('crypto');
var fs = require('fs');
var algo = 'md5';
var shasum = crypto.createHash(algo);
    var path=require('path');
    
var sponsored = 'sponsored';
var random = 'bdaq-team';
var rowLimit =10;
var valid_ether=(ether_address)=> {
    return ethereum_address.isAddress(ether_address);
}
var showInbox = (message, req, res) => {
    let start =0;
    if(req.body.start){
        start = parseInt(req.body.start);
    }
    if (req.session.user) {
        usermodel.pagination(req.session.user.ethadd,rowLimit,start)
            .then(function (usrmsg) {
                       let userdata = {
                            msg_data: usrmsg,
                            currentUser: req.session.user,
                            page: 'user',
                            message: message
                        };
                        res.render('user/inbox', { data: userdata });
                  
            }).catch(function (err) {
                console.log('Caught an error!', err);
            });
    } else {
        userdata = {
            error: 'Session expired',
            page: 'common'
        };
        res.render('common/landing', { data: userdata });
    }

}
var validateEtherAddress = (req, res) => {
    if (valid_ether(req.body.ethadd)) {
        usermodel.validate_secured_login(req.body.ethadd)
            .then(function (isSecured) {
                if (isSecured.length > 0) {
                    userdata = { message: 'You are already secured please login', page:'common' };
                    res.render('common/login', { data: userdata });
                }
                else {
                    let newUser = {
                        ethadd: req.body.ethadd,
                        email: 'unsecured',
                        profile_pic: '',
                    };
                    req.session.user = newUser;
                    usermodel.validate_unsecured_login(req.body.ethadd, (unsecured_login) => {
                        if (unsecured_login.length > 0) {
                            showInbox('Welcome back: your account is unsecured <a href="/register"> Get it secured</a>', req, res);

                        } else {
                            let totalSponsored = 0
                            let totalRandom = 0;
                            usermodel.countMessage(sponsored)
                                .then(function (sponsoredCount) {
                                    totalSponsored = sponsoredCount[0].count;
                                    usermodel.countMessage(random)
                                        .then(function (randomCount) {
                                            totalRandom = randomCount[0].count;
                                            if ((totalRandom >= 3) && (totalSponsored >= 3)) {
                                               
                                                      usermodel.submitFirstTransaction(req.body.ethadd, random, sponsored)
                                                            .then(function (value) {
                                                              //  usermodel.lastLogin(req.body.ethadd);
                                                                showInbox('Welcome : your account is unsecured <a href="/register"> Get it secured</a>',
                                                                    req, res);
                                                          })
                                                          .catch(function (err) {
                                                                console.log('Submit First Transaction', err);
                                                           });
                                                  
                                            } else {
                                                userdata = {
                                                    error: 'No messages found, please contact to admin. ',
                                                    page: 'common'
                                                };
                                                res.render('common/landing', { data: userdata });
                                            }
                                        })
                                })




                            // if(usermodel.countSponsored(sponsored)>)


                        }//new user
                    });//validate unsecure login
                }
            });//validate secure login


    } else {
        let userdata1 = {
            error: 'Invalid Ether Wallet Address',
            page: 'common'
        };
        res.render('common/landing', { data: userdata1 });
    }
}
var deleteMessage = (req, res) => {
    
    let messageStr = req.body.messageIds;
    let messageArray = messageStr.split(",");

    for (let i = 1; i < messageArray.length; i++) {
        usermodel.delete_usermsg(parseInt(messageArray[i]));
    }
    //res.redirect('/myMessages');
    showInbox('', req, res);
    
}
var deleteSend = (req, res) => {  
    let messageStr = req.body.messageIds;
    let messageArray = messageStr.split(",");
    for (let i = 1; i < messageArray.length; i++) {
        usermodel.delete_send(parseInt(messageArray[i]));
    }
    showInbox('', req, res); 
}
var sendBoxPage = (req, res) => {
    if (req.session.user) {
        usermodel.userSendMessage(req.session.user.ethadd)
            .then(function (usrsendmsg) {
                let userdata = {
                    sendData: usrsendmsg,
                    currentUser: req.session.user,
                    page: 'user'
                };
                res.render('user/sendMail', { data: userdata });
            }).catch(function (err) {
                console.log('Caught an error!', err);
            });

    } else {
        userdata = {
            error: 'Session expired',
            page: 'common'
        };
        res.render('common/landing', { data: userdata });
    }
}
var logout = (req, res) => {
    if (req.session.user) {
        //if (req.session.user) {
        // fun.lastLogin(req.session.user.ethadd);
        req.session.destroy(function () {
            let usrdata = {
                message: 'Logged out successfully',
                page: 'common'
            }
            res.render('common/landing', { data: usrdata });
        });
    } else {
        let usrdata = {
            page: 'common'
        }
        res.render('common/landing', { data: usrdata });
    }
}
var sendMessage =(req, res)=>{

       let senderAddress = req.body.ethadd;
       let etherAddress = req.body.rec_ethadd;
       let subject = req.body.subject;
       let message = req.body.message;
       var filename ='';
       
       if (req.files.attachments){
            let file  =  req.files.attachments; 
            let fileStr = file.name.split('.');
            filename = fileStr[0]+"_" + new Date().getTime() + '.' + fileStr[1];
            let filePath = 'public/upload/' + filename;
          
            file.mv(filePath, function (err) {
            if (err){
                console.log("Error on upload file");
            }
            //---------hash-----------//
            var s = fs.ReadStream(filePath);
            s.on('data', function(d) { shasum.update(d); });
            s.on('end', function() {
                var documentHash = shasum.digest('hex');
                console.log("this is has "+documentHash);
            });
           }); 
       }
       let reciever_address = new Array();
       reciever_address = etherAddress.split(',');
       usermodel.msgContent(senderAddress, subject, message)
            .then(function (msgContent) {
                if(documentHash){
                usermodel.submit_transaction(senderAddress, reciever_address, subject, msgContent.insertId, filename, documentHash)
                    .then(function (effectedRows) {
                     showInbox('', req, res);
                    })
                }else{
                    usermodel.submit_transaction(senderAddress, reciever_address, subject, msgContent.insertId, filename,'')
                    .then(function (effectedRows) {
                     showInbox('', req, res);
                    }) 
                }
            }).catch(function (err) {
                console.log('Database error unable to handle msg content', err);
            });
  
}
var markAsRead =(req, res)=>{
    let size = req.body.searchid.length;
    for (let i = 0; i < size; i++) {
        usermodel.markasread(parseInt(req.body.searchid[i]));    
    }
}
var markAsUnRead =(req, res)=>{
let size = req.body.searchid.length;
for (let i = 0; i < size; i++) {
    usermodel.markasunread(parseInt(req.body.searchid[i]));
 }
}
var pagination =(req, res)=>{
    let start = req.body.start;
   
    let startpage = parseInt(start);

    usermodel.pagination('0xfa052221e9e1d8c8d49d1c03b4eefeb7e8670f6e',5, startpage)
    .then((result1)=>{
        let userdata1 = {
            msg_data: result1,
            currentUser: req.session.user,
            mms: 'ab',
            page: 'user' 
        };
     
       res.render('user/inbox', { data: userdata1 });
    }).catch((error)=>{
        console.log("Error on pagination"+error);
    })
}
var updateProfilePage =(req, res) =>{
    let comData ={
        page:"common",
    }
    res.render('common/updateProfile', {data: comData});
}
var updateProfile =(req, res) =>{
    if(req.session.email!== 'unsecured'){
        let email = req.session.user.email;
        let fullname = req.body.reg_fullname;
        let contact = req.body.reg_contact;
        let reg_gender = req.body.reg_gender;  
        if (!req.files)
        return res.status(400).send('No files were uploaded.');
        let file = req.files.uploaded_image; 
        let img_name = file.name;

        var filePath = 'public/images/' + img_name;
        file.mv(filePath, function (err) {
          if (err){
            let comData ={
                page:"common",
                error: "Image can't upload"
            }
            res.render('common/error-page', {data: comData});
          }
        });
        usermodel.updateUserNew(email, fullname, contact, reg_gender, img_name)
        .then(function (msgContent) {
            showInbox('', req, res);
        }).catch(function (err) {
              let comData ={
                  page:"common",
                  error: err
              }
              res.render('common/error-page', {data: comData});
             
          });
    }
}
var downloadFile = (req, res)=>{
    let id = req.params.id;
    usermodel.getAttechmentName(id)
    .then(function (filename) {
   
        let downloadfile = path.resolve(".")+'/public/upload/'+filename[0].attachment;
        if(fs.existsSync(downloadfile)){
            res.download(downloadfile); // magic of download fuction
            var s = fs.ReadStream(downloadfile);
            s.on('data', function(d) { shasum.update(d); });
            s.on('end', function() {
            var d = shasum.digest('hex');
            //console.log("hash value of file "+d);
            });
        }else{
            let comData ={
                page:"common",
                error: "File not found",
                currentUser: req.session.user
            }
           
            res.render('common/error-page', {data: comData});
        }
       
  

    }).catch(function (err) {
          let comData ={
              page:"common",
              error: err,
              currentUser: req.session.user
          }
         
          res.render('common/error-page', {data: comData});
         
      });
}

var saveToDraft = (req, res) =>{
    usermodel.saveToDraft(req, res);
}
var getDraft = (req, res)=>{
    let ewa = req.params.ewa;
     usermodel.getDraft(ewa)
    .then(function (draftdata) {
        let userdata1 = {
            msg_data: draftdata,
            currentUser: req.session.user,
            mms: 'ab',
            page: 'user' 
        };
     
       res.render('user/draft', { data: userdata1 });
    }).catch((err)=>{

    });
}
module.exports = {
    validateEtherAddress,//Unsecured user inbox
    deleteMessage,//Delete User Message
    sendBoxPage,//Open Send Box
    showInbox,//User inbox
    sendMessage,//Send Message
    logout,//Log out user
    valid_ether,//validate EWA
    deleteSend,//Delete Send message
    updateProfile,//update profile page
    updateProfilePage,
    markAsUnRead,
    pagination,
    markAsRead,
    downloadFile,
    saveToDraft,
    getDraft
  //update profile
}