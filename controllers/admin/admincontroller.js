
var sponsored = 'sponsored';
var random = 'bdaq-team';
var adminmodel = require('../../models/admin/adminmodel');
var usermodel = require('../../models/user/usermodel');
var restLink = require('../../config/commonconfig');
var excelCreator = require('./excelCreator');
var bcrypt = require('bcrypt');
const BusinessNetworkConnection = require("composer-client").BusinessNetworkConnection;
const connection = new BusinessNetworkConnection();
var request = require("request");

var adminCard = "admin@messaging";
//var adminCard = "alice@messaging";
var saltRounds = 10,
    salt = bcrypt.genSaltSync(saltRounds);

var defaultPage = (req, res) => {
    let adminData = {
        page: 'common'
    };
    res.render('common/login',
        { data: adminData });
}

var allUser = (req, res) => {
    if (req.session.admin) {
        adminmodel.totalUser()
            .then((securedUser) => {
                let adminData = {
                    securedUserMsg: securedUser,
                    otherUser: req.session.user,
                    page: 'admin'

                }
                res.render('admin/alluser',
                    {
                        data: adminData,
                    });
            })
            .catch(() => {
                console.log("No response from database");
            });
    } else {
        let adminData = {
            error: 'seesion expired',
            page: 'common'
        };
        res.render('common/login',
            { data: adminData });
    }
}

var adminInboxPage = (req, res) => {
    if (req.session.admin) {
        adminmodel.adminInbox()
            .then((admininbox) => {
                let adminData = {
                    msg_data: admininbox,
                    page: 'admin'
                }
                res.render('admin/adminInbox',
                    {
                        data: adminData,
                    });

            }).catch(() => {
                console.log("No response from database");
            })
    } else {
        let adminData = {
            error: 'seesion expired',
            page: 'common'
        };
        res.render('common/login',
            { data: adminData });
    }
};

var adminReportPage = (req, res) => {
    if (req.session.admin) {
        adminmodel.totalUser()
            .then((securedUser) => {
                let adminData = {
                    securedUserMsg: securedUser,
                    page: 'admin'
                }
                res.render('admin/adminreport',
                    {
                        data: adminData,
                    });
            })
            .catch(() => {
                console.log("No response from database");
            });
    } else {
        let adminData = {
            error: 'seesion expired',
            page: 'common'
        };
        res.render('common/login',
            { data: adminData });
    }
};

var adminAllUserPage = (req, res) => {
    allUser(req, res);
};

var findUser = (req, res) => {
    if (req.session.admin) {
        let userName = req.body.userName;
        let status = req.body.status;
        let active = 0;
        if (status == 'Unblock') active = 1;
        adminmodel.rearchUsers(userName, active)
            .then((userFound) => {
                let adminData = {
                    securedUserMsg: userFound,
                    page: 'admin'
                }
                res.render('admin/adminreport',
                    {
                        data: adminData,
                    });

            }).catch(() => {
                console.log("Can not find user");
            })
    } else {
        let adminData = {
            error: 'seesion expired',
            page: 'common'
        };
        res.render('common/login',
            { data: adminData });
    }
}

var createExcelFile = (req, res) => {
    if (req.session.admin) {
        adminmodel.totalUser()
            .then((securedUser) => {
                let values1 = new Array();
                for (let i = 0; i < securedUser.length; i++) {
                    let values = { userName: securedUser[i].full_name, email: securedUser[i].email, totalMessages: securedUser[i].total_messages, sendMessages: securedUser[i].send_messages, status: securedUser[i].active };
                    values1.push(values);

                }
                excelCreator.createExcel(res, values1);

            })
            .catch((err) => {
                console.log("Can not create Excel" + err);
            });
    } else {
        let adminData = {
            error: 'seesion expired',
            page: 'common'
        };
        res.render('common/login',
            { data: adminData });
    }
};

var logout = (req, res) => {
    if (req.session.admin) {
        req.session.destroy(function () {
            let usrdata = {
                message: 'Logged out successfully',
                page: 'common'
            }
            res.render('common/landing', { data: usrdata });
        });
    } else {
        let usrdata = {
            message: 'Session Expired',
            page: 'common'
        }
        res.render('common/login', { data: usrdata });
    }
};

var bulkSend = (req, res) => {
    if (req.session.admin) {
        let senderAddress = req.body.senderAddress;
        let etherAddress = req.body.etherAddress;
        console.log("senderAddress "+senderAddress);
        console.log("etherAddress "+etherAddress);
        let subject = req.body.subject;
        let message = req.body.message1
        let reciever_address = new Array();
        reciever_address = etherAddress.split(',');
        usermodel.msgContent(senderAddress, subject, message)
            .then(function (savedId) {
                usermodel.submit_transaction(senderAddress, reciever_address, subject, savedId.insertId,'','')
                    .then((result) => {
                        allUser(req, res);
                    }).catch((err) => {
                        console.log("Transaction not submit"+err);
                    });
            }).catch((err) => {
                console.log("Message content not save"+err);
            });
    } else {
        let adminData = {
            error: 'seesion expired',
            page: 'common'
        };
        res.render('common/login',
            { data: adminData });
    }
};
var blockUser = (req, res) => {
    if (req.session.admin) {
        let user = req.body.buserId;
        adminmodel.blockUser(user)
            .then((admininbox) => {
                allUser(req, res);

            }).catch(() => {
                console.log("Can not block user");
            })
    } else {
        let adminData = {
            error: 'seesion expired',
            page: 'common'
        };
        res.render('common/login',
            { data: adminData });
    }
};

var unBlockUser = (req, res) => {
    if (req.session.admin) {
        let user = req.body.userId;
        adminmodel.unblockUser(user)
            .then((admininbox) => {
                allUser(req, res);

            }).catch(() => {
                console.log("Can not block user");
            })
    } else {
        let adminData = {
            error: 'seesion expired',
            page: 'common'
        };
        res.render('common/login',
            { data: adminData });
    }
};

var searchRegistered = (req, res) => {
    if (req.session.admin) {
        let userName = req.body.userName;
        adminmodel.rearchAllUsers(userName)
            .then((userFound) => {
                adminmodel.totalUser()
                    .then((securedUser) => {
                        let adminData = {
                            securedUserMsg: userFound,
                            otherUser: req.session.user,
                            page: 'admin'
                        }
                        res.render('admin/alluser',
                            {
                                data: adminData,
                            });
                    })
                    .catch(() => {
                        console.log("No response from database");
                    });
            }).catch(() => {
                console.log("No response from database");
            });
    } else {
        let adminData = {
            error: 'seesion expired',
            page: 'common'
        };
        res.render('common/login',
            { data: adminData });
    }
};

var changePassword = (req, res) => {

    let email = req.body.email_id;
    let password = req.body.reg_password;
    let confirm = req.body.reg_password_confirm;
   // console.log(email + "pass " + password + "conf" + confirm);
    if (req.session.user) {
        if (req.session.user.email == email) {
            req.session.destroy();
        }
    }
    if (password !== confirm) return res.end('passwords do not match');
    let newpassword = bcrypt.hashSync(confirm, salt);
    usermodel.updatePassword(email, newpassword)
        .then(function (usrsendmsg) {
            allUser(req, res);
        }).catch(function (err) {
            console.log('Error to reset Password', err);
        });

};

var logOutUser = (req, res) => {
    let email = req.body.email;
   // console.log("email" + email);
    if (req.session.user) {
        if (req.session.user.email == email) {
            req.session.destroy(function () {
                allUser(req, res);
            });
        } else {
            allUser(req, res);
        }
    } else {
        allUser(req, res);
    }
}

var logOutAdmin = (req, res) => {
    if (req.session.admin) {
        req.session.destroy(function () {
            let adminData = {
                message: 'Logged out successfully',
                page: 'common'
            };
            res.render('common/login', { data: adminData });
        });
    } else {
        let adminData = {
            error: 'seesion expired',
            page: 'common'
        };
        res.render('common/login', { data: adminData });
    }
}
var changeMessageStatus = (req, res) => {
    let status = parseInt(req.params.status);
    let messageId = parseInt(req.params.id);
    if (req.session.admin) {
        adminmodel.changeMessageStatus(status, messageId)
            .then((result) => {
                adminInboxPage(req, res)
            }).catch((err) => {
                console.log("Err" + err)
            });
    } else {
        let adminData = {
            error: 'seesion expired',
            page: 'common'
        };
        res.render('common/login',
            { data: adminData });
    }
};

var sendAdminMessage = (req, res) => {
    let messageType = req.body.messageType;
    let subject = req.body.subject;
    let message = req.body.message;
    let creator = sponsored;
    // console.log("Type "+messageType+" Subject: "+subject+" Message: "+message+" Creator: "+creator);
    if (messageType !== sponsored) creator = random;
    adminmodel.sponsored(creator, subject, message)
        .then(function (msgContent) {
            allUser(req, res);
        })
        .catch(function (err) {
            console.log("Error on save sponsored msg" + err);
        });
};

var exportIncompleteUser = (req, res) => {
    adminmodel.airDropList()
        .then(function (users) {
            var json2csv = require('json2csv').parse;
            const fields = [{
                label: 'EWA',
                value: 'ether_address'
            }, {
                label: 'Token',
                value: 'Token'
            }];
            const opts = { fields };
            const data = json2csv(users, opts);
            const todayDate = new Date().toISOString().replace(/T/, '-').replace(/\..+/, '');
            // EXPORT FILE
            const fileName = 'upload-file' + todayDate + '.csv';
            res.attachment(fileName);
            res.status(200).send(data);
        });

};
var allUserPagination = (req, res) => {
    let pageno = parseInt(req.body.pageno);
    adminmodel.adminInboxPagination(pageno)
    .then((securedUser) => {   
        let adminData = {
            securedUserMsg: securedUser,
            otherUser: req.session.user,
            page: 'admin'
        }
        res.render('admin/alluser',
            {
                data: adminData,
            });
    })
    .catch(() => {
        console.log("No response from database");
    });
}
var paging =(req, res)=>{
    adminmodel.alluserData(req, res);
}
//**************Blockchain***************//
var blockChain = (req, res) => {
    getHistorian()
        .then((result) => {

            let adminData = {
                history: result,
                page: 'admin'
            };

            res.render('admin/historian',
                { data: adminData });
        }).catch((error)=>{
            let adminData = {
                error: 'Blockchain not connected',
                page: 'admin'
            };
            res.render('admin/historian',
                {
                    data: adminData
                });
        })


}

async function getHistorian() {
    try {
        await connection.connect(adminCard);
        var historyRegistry = await connection.getHistorian();
        var records = await historyRegistry.getAll();
        //console.log(records);
        await connection.disconnect();
        return records.sort(function (a, b) {
       //     console.log(b.transactionTimestamp);

            return new Date(b.transactionTimestamp) - new Date(a.transactionTimestamp);
//            console.log(b.transactionTimestamp);
        })
    } catch (error) {
        let adminData = {
            error: 'Blockchain not connected',
            page: 'admin'
        };
        res.render('admin/historian',
            {
                data: adminData
            });
        await connection.disconnect();
    }
}
var blockChainView = (req, res) => {
    request.get(
        restLink.hyperledgerRestServer +
        "org.messaging.network.MessageExchange",
        (error, response, body) => {
            if (error) {
                let adminData = {
                    error: 'Blockchain not connected',
                    page: 'admin'
                };
                res.render('admin/resttransaction',
                    {
                        data: adminData
                    });
            } else {
                try{
                    let jsonData = JSON.parse(decodeURI(body));
                    let adminData = {
                        history: jsonData,
                        page: 'admin'
                    };
                    res.render('admin/resttransaction',
                        {
                            data: adminData
                        });
                }catch(err){
                    let adminData = {
                        error: 'Blockchain not connected',
                        page: 'admin'
                    };
                    res.render('admin/resttransaction',
                        {
                            data: adminData
                        });
                }
               
             
                
            }


        });
}

async function getRegistry() {

    try {
        await connection.connect(adminCard);
        var historyRegistry = await connection.getTransactionRegistry('org.messaging.network.MessageExchange');
        var records = await historyRegistry.getAll();
        await connection.disconnect();
        return records.sort(function (a, b) {
            return new Date(b.transactionTimestamp) - new Date(a.transactionTimestamp);
        })
    } catch (error) {
        let adminData = {
            error: 'Blockchain not connected',
            page: 'admin'
        };
        res.render('admin/chainData',
            {
                data: adminData
            });
        await connection.disconnect();
    }
}
var getAssetRegistry= (req, res)=>{
    getRegistry()
    .then((result) => { 
       // console.log(result)         
        let adminData = {
            history: result,
            page: 'admin'
        };
        res.render('admin/chainData',
            {
                data: adminData
            });
    }).catch((err)=>{
        //console.log(err);
        let adminData = {
            error: 'Blockchain not connected',
            page: 'admin'
        };
        res.render('admin/chainData',
            {
                data: adminData
            });
    })

}
module.exports = {
    adminInboxPage, //Admin Inbox
    adminReportPage, //Admin Report Page
    adminAllUserPage, //All user page
    findUser, //Find user by admin
    createExcelFile, //Create Excel by admin
    bulkSend, //Send Bulk message
    blockUser, //Block user
    unBlockUser,//Unblockuser
    searchRegistered, //searchRegistered
    changePassword, //change Password
    logOutUser, //Log out user
    allUser,
    logout,
    defaultPage,//Admin Dashboard
    changeMessageStatus,//change Message Status
    sendAdminMessage, //Send Admin Message
    logOutAdmin, //Logout admin
    exportIncompleteUser,
    // Generate CSV
    allUserPagination,
    blockChain,
    blockChainView,
    getAssetRegistry,
    paging

};