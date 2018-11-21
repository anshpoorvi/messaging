var usermodel = require('../../models/user/usermodel');
var userController = require('../../controllers/user/usercontroller');
var adminController = require('../../controllers/admin/admincontroller');
var emailContaint = require('../../controllers/common/emailContent');
var emailConfig = require('../../config/emailconfig');
const BusinessNetworkConnection = require("composer-client").BusinessNetworkConnection;//Blockchain Import
const connection = new BusinessNetworkConnection();//Blockchain Import
var adminCard = "admin@messaging";//Blockchain Import
//var adminCard = "alice@messaging";//Blockchain Import
var sponsored = 'sponsored';
var random = 'bdaq-team';

var bcrypt = require('bcrypt');
var saltRounds = 10,
    salt = bcrypt.genSaltSync(saltRounds);


var defaultPage = (req, res) => {
    let common = {
        page: 'common',
        currentUser: req.session.user
    }
    res.render('common/landing', { data: common });
}
var about = (req, res) => {
    let common = {
        page: 'common',
        currentUser: req.session.user
    }
    res.render('common/about', { data: common });
}
var registerPage = (req, res) => {
    let common = {
        page: 'common',
        currentUser: req.session.user
    }
    res.render('common/register', { data: common });
}
var loginPage = (req, res) => {
    let common = {
        page: 'common',
        currentUser: req.session.user
    }
    res.render('common/login', { data: common });
}
var restPage = (req, res) => {
    let common = {
        page: 'common',
        currentUser: req.session.user
    }
    res.render('common/reset-password', { data: common });
}
var policyPage = (req, res) => {
    let common = {
        page: 'common',
        currentUser: req.session.user
    }
    res.render('common/policy', { data: common });
}
var getRandomInt = (max) => {
    return Math.floor(Math.random() * Math.floor(max));
}

var validateLogin = (req, res) => {
    var pw = req.body.password;
    usermodel.validateLogin(req.body.ethadd)
        .then(function (result) {
            if (result.length > 0 && bcrypt.compareSync(pw, result[0].password)) {
                if (req.body.remember_me) {
                    req.session.cookie.maxAge = 2592000000; // 30*24*60*60*1000 Rememeber 'me' for 30 days
                }
                let newUser = {
                    ethadd: result[0].ether_address,
                    email: result[0].email,
                    role: result[0].role,
                    profile_pic: result[0].profile_pic
                };
                req.session.user = newUser;
                usermodel.lastLogin(result[0].ether_address);
                if (result[0].role == 'admin') {
                    let newAdmin = {
                        ethadd: result[0].ether_address,
                        email: result[0].email,
                        role: result[0].role,
                        profile_pic: result[0].profile_pic
                    };
                    req.session.admin = newAdmin;
                    adminController.allUser(req, res);
                } else {
                    userController.showInbox('', req, res);
                }
            } else {
                let commonData = {
                    error: 'incorect user name or password',
                    page: 'common'
                }
                res.render('common/login', { data: commonData });
            }

        }).catch(function (err) {
            console.log('Caught an error!', err);
        });
}

var registerUser = (req, res) => {
    let ethadd = req.body.reg_username;
    let email = req.body.reg_email;
    let password = bcrypt.hashSync(req.body.reg_password, salt);
    if (userController.valid_ether(ethadd)) {
        if (1 == req.body.reg_agree) {
            agreement = 1;
        } else {
            agreement = 0;
        }
        usermodel.isAvailable(ethadd)
            .then(function (isvalid) {
                if (isvalid.length >= 1) {
                    usermodel.validate_secured_login(ethadd)
                        .then(function (secured_login) {
                            usermodel.validate_secured_email(email)
                            .then(function(validemail){
                            if (secured_login.length > 0 || validemail.length >0) {
                                let comData = {
                                    page: "common",
                                    message: "You are already secured please login"
                                }
                                res.render('common/login', { data: comData });
                            } else {
                                let token = getRandomInt(2222);
                                let url = req.protocol + "://" + req.get('host');
                                let msgcont = emailContaint.confirmMsgContent(url, email, token);

                                usermodel.updateUserModified(ethadd, email, password, token)
                                    .then(function (msgContent) {
                                        emailConfig.sendEMail(email, "Bdaq verificatiion", msgcont)
                                            .then(function (mail) {
                                                let comData = {
                                                    page: "common",
                                                    message: "A secure link has been sent to your email."
                                                }
                                                res.render('common/info', { data: comData });
                                            }).catch(function (err) {
                                                //  console.log("error on send mail :"+err);
                                                let comData = {
                                                    page: "common",
                                                    error: "Unable to send confirmation link."
                                                }
                                                res.render('common/register', { data: comData });

                                            });

                                    }).catch(function (err) {
                                        let comData = {
                                            page: "common",
                                            error: "Email id already exists"
                                        }
                                        res.render('common/register', { data: comData });
                                    });
                            }
                        }).catch(function (err) {
                            console.log('1: Caught an error!', err);
                        });
                        }).catch(function (err) {
                            console.log('2: Caught an error!', err);
                        });
                } else {
                   
                    let token = getRandomInt(2222);
                    let url = req.protocol + "://" + req.get('host');
                    let msgcont = emailContaint.confirmMsgContent(url, email, token);
                    usermodel.insertUserModified(ethadd, email, password, token)
                        .then(function (msgContent) {
                            
                            createUser(msgContent, '',ethadd, email);
                            usermodel.submitFirstTransaction(ethadd, random, sponsored)
                                .then(function (value) {
                                    usermodel.userMessage(ethadd)
                                        .then(function (usrmsg) {
                                            usermodel.userSendMessage(ethadd)
                                                .then(function (usrsendmsg) {
                                                    userMsg = usrmsg;
                                                    totalSize = usrmsg.length;
                                                    userSendMsg = usrsendmsg;
                                                    userSendSize = usrsendmsg.length;
                                                    emailConfig.sendEMail(email, "Bdaq verificatiion", msgcont)
                                                        .then(function (msgContent) {
                                                            let comData = {
                                                                page: "common",
                                                                message: " A secure link has been sent to your email."
                                                            }
                                                            res.render('common/info', { data: comData });
                                                        }).catch(function (err) {

                                                            let comData = {
                                                                page: "common",
                                                                error: "Unable to send confirmation link"
                                                            }
                                                            res.render('common/register', { data: comData });
                                                        });
                                                }).catch(function (err) {
                                                    console.log('3: Caught an error!', err);
                                                });
                                        }).catch(function (err) {
                                            console.log('4: Caught an error!', err);
                                        });
                                })
                                .catch(function (err) {
                                    console.log('5: Caught an error!', err);
                                });

                            // **************/Send Default Msg*****************/

                        }).catch(function (err) {
                            let comData = {
                                page: "common",
                                error: "Email id already exists"
                            }
                            res.render('common/register', { data: comData });

                        });



                }
            })
            .catch(function (err) {
                console.log('Caught an error!', err);
            });

    } else {
        let comData = {
            page: "common",
            ewaError: "Invalid ether address",
        }
        res.render('common/register', { data: comData });
    }

}
var forgotUserPassword = (req, res) => {
    let email = req.body.email;
    let url = req.protocol + "://" + req.get('host');
    let token = getRandomInt(2222);
    usermodel.setToken(email, token)
        .then(function (isvalid) {
            emailConfig.sendEMail(email, "bdaq verification", emailContaint.resetMsgContent(url, email, token));
            let comData = {
                message: "Verification link send to your registered email",
                page: 'common'
            }
            res.render('common/reset-password', { data: comData });

        })
        .catch(function (err) {
            console.log("Error to set token" + err)
        })




}

var restUserPassword = (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    let confirm = req.body.confirm;
    if (password !== confirm) return res.end('passwords do not match');
    let newpassword = bcrypt.hashSync(confirm, salt);
    usermodel.updatePassword(email, newpassword)
        .then(function (usrsendmsg) {
            let usdata = {
                page: 'common',
                message: 'Password reset successfully ! please login'
            }
            res.render('common/login', { data: usdata });

        }).catch(function (err) {
            console.log('Error to reset Password', err);
        });
}
var restByLink = (req, res) => {
    let email = req.params.email;
    let token = req.params.token;
    usermodel.bdaqVerification(email, token)
        .then(function (usrsendmsg) {
            if (usrsendmsg.length >= 1) {
                let usdata = {
                    page: 'common',
                    email: email,
                    message: 'Link confirmed! please reset your password'
                }
                res.render('common/reset', { data: usdata });
            } else {
                let usdata = {
                    page: 'common',
                    error: 'Link expired! please try again'
                }
                res.render('common/login', { data: usdata });
            }
        })

}

var bdaqVerification = (req, res) => {
    let token = req.params.token;
    let email = req.params.email;
    usermodel.bdaqVerification(email, token)
        .then(function (usrsendmsg) {
            if (usrsendmsg.length >= 1) {
                usermodel.verifyEmail(email)
                    .then(function (emailSecured) {
                        let usdata = {
                            page: 'common',
                            email: email,
                            message: 'Confirmation successfully done.! Procedure of secure account under process it may take 12 to 24 hours.'
                        }
                        res.render('common/info', { data: usdata });
                    }).catch((err) => {
                        console.log("Error to secure email:" + err)
                    })
            } else {
                let usdata = {
                    page: 'common',
                    error: 'Link expired! please try again'
                }
                res.render('common/login', { data: usdata });
            }


        }).catch(function (err) {
            console.log('Error to reset Password', err);
        });
}
//****************************** */
// Blockchain code 
//****************************** */

async function createUser(user, fullname,ewa, email){
    try {
     var conn =  await connection.connect(adminCard);
     var factory = await conn.getFactory();
     var userTxn = await factory.newTransaction("org.messaging.network","NewUser");
     userTxn.userId = user.insertId.toString();
     userTxn.name = fullname;
     userTxn.etherWalletAddress = ewa;
     userTxn.email =email;
     await connection.submitTransaction(userTxn);
     await connection.disconnect();
     console.log("success!!!");
    } catch (error) {
        console.log(error);
        await connection.disconnect();
    }
 }
 
module.exports = {
    defaultPage, //Home page
    about, //about us page
    policyPage,//Policy and Terms
    restPage, //Reset Page
    loginPage, //Login Page
    registerPage, //register Page
    validateLogin,//validate Login
    registerUser,// Register user
    forgotUserPassword,// ForgotUserPassword
    restUserPassword,// Reset user password
    restByLink,//Reset password
    bdaqVerification
    //Email varification 
};