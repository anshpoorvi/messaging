

//console.log('this is function');
var mysql = require('mysql');
const connect = require('../../config/dbconnection');
const BusinessNetworkConnection = require("composer-client").BusinessNetworkConnection;
const connection = new BusinessNetworkConnection();
var adminCard = "admin@messaging";
//var adminCard = "alice@messaging";


var validate_secured_login = (ether_address) => {
    return new Promise(function (resolve, reject) {
        let get_sql1 = "select ether_address  from user where  ether_address= ? and secure = 1";
        connect.con.query(get_sql1, ether_address, function (err, result) {
            if (err) { reject(err); }
            else { resolve(result); }

        });
    });
};
var validate_secured_email = (email) => {
    return new Promise(function (resolve, reject) {
        let get_sql1 = "select email  from user where  email= ? and secure = 1";
        connect.con.query(get_sql1, email, function (err, result) {
            if (err) { reject(err); }
            else { resolve(result); }

        });
    });
};
var validate_unsecured_login = (ether_address, callBack) => {
    let get_sql = "select ether_address from user where  ether_address= ? and secure =0";
    connect.con.query(get_sql, ether_address, function (err, result) {
        if (err) console.log(err)
        else
            callBack(result);
    });
};
var isAvailable = (ether_address) => {
    return new Promise(function (resolve, reject) {
        let get_sql = "select ether_address from user where  ether_address= ?";
        connect.con.query(get_sql, ether_address, function (err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

var userMessage = (ether_address) => {
    return new Promise(function (resolve, reject) {
        let user_msg = "SELECT msg_transaction.id, msg_transaction.sender_address, msg_transaction.subject,msg_transaction.reciever_address, msg_content.message, msg_content.status, msg_transaction.date_time, msg_transaction.read_status, msg_transaction.delete_status FROM `msg_transaction` LEFT JOIN `msg_content` ON msg_content.id = msg_transaction.message_id WHERE msg_transaction.reciever_address =? and msg_transaction.delete_status = 0 ORDER BY msg_transaction.date_time DESC";
        connect.con.query(user_msg, ether_address, function (err, result) {

            if (err) {
                reject("Not found");
            } else {
                resolve(result);
            }
        });
    });
}

var userSendMessage = (ether_address) => {
    return new Promise(function (resolve, reject) {
        let user_msg = "SELECT msg_transaction.id, msg_transaction.sender_address, msg_transaction.subject,msg_transaction.reciever_address, msg_content.message, msg_transaction.date_time, msg_transaction.read_status, msg_transaction.delete_status, msg_transaction.attachment FROM `msg_transaction` LEFT JOIN `msg_content` ON msg_content.id = msg_transaction.message_id WHERE msg_transaction.sender_address =? and msg_transaction.send_delete = 0  ORDER BY msg_transaction.date_time DESC";
        connect.con.query(user_msg, ether_address, function (err, result) {

            if (err) {
                reject("Not found");
            } else {
                resolve(result);
            }
        });
    });
}

var sponsherMessage = (sender_address) => {
    let sqlQuery = "SELECT * FROM  ?? where sender_address = ? and status = 1 ORDER BY date_time DESC LIMIT 2";
    let table = ["msg_content", sender_address];
    let query = mysql.format(sqlQuery, table);
    return commonFunction(query);
}

var alwaysAppearMessage = (Always_appear) => {
    let sqlQuery = "SELECT * FROM  ?? where sender_address = ? ORDER BY RAND() LIMIT 3";
    let table = ["msg_content", Always_appear];
    let query = mysql.format(sqlQuery, table);
    return commonFunction(query);
}
var countMessage = (message) => {
    let sqlQuery = "SELECT count(sender_address) as count FROM  ?? where sender_address = ?";
    let table = ["msg_content", message];
    let query = mysql.format(sqlQuery, table);
    return commonFunction(query);
}

var create_user = (ether_add) => {
    return new Promise(function (resolve, reject) {
        var sql = "insert into user(ether_address) values('" + ether_add + "')";
        connect.con.query(sql, function (err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }

        });
    });
};

var delete_usermsg = (id) => {
    let sqlQuery = "update ?? set delete_status =1 WHERE id = ?";
    let table = ["msg_transaction", id];
    let query = mysql.format(sqlQuery, table);
    return commonFunction(query);
}
var delete_send = (id) => {
    let sqlQuery = "update ?? set send_delete =1 WHERE id = ?";
    let table = ["msg_transaction", id];
    let query = mysql.format(sqlQuery, table);
    return commonFunction(query);
}

var validateLogin = (username) => {
    let sqlQuery = "select * from ?? where  email = ? and active = 1 and secure = 1";
    let table = ["user", username];
    let query = mysql.format(sqlQuery, table);
    return commonFunction(query);
}

var markasread = (id) => {
    let sqlQuery = "update ?? set read_status=1 WHERE id = ?";
    let table = ["msg_transaction", id];
    let query = mysql.format(sqlQuery, table);
    return commonFunction(query);
}
var markasunread = (id) => {
    let sqlQuery = "update ?? set read_status=0 WHERE id = ?";
    let table = ["msg_transaction", id];
    let query = mysql.format(sqlQuery, table);
    return commonFunction(query);
}

var submitFirstTransaction = (reciever_address, Always_appear, sponsored) => {
    return new Promise(function (resolve, reject) {
        sponsherMessage(sponsored)
            .then(function (sponsherM) {

                alwaysAppearMessage(Always_appear)
                    .then(function (alwaysAppearRes) {

                        var msg_transaction = "insert into msg_transaction(`sender_address`, `reciever_address`,`subject`, `message_id`, `date_time`) VALUES ?";

                        var values = [
                            [sponsored, reciever_address, sponsherM[0].subject, sponsherM[0].id, new Date()],
                            [sponsored, reciever_address, sponsherM[1].subject, sponsherM[1].id, new Date()],
                            [Always_appear, reciever_address, alwaysAppearRes[0].subject, alwaysAppearRes[0].id, new Date()],
                            [Always_appear, reciever_address, alwaysAppearRes[1].subject, alwaysAppearRes[1].id, new Date()],
                            [Always_appear, reciever_address, alwaysAppearRes[2].subject, alwaysAppearRes[2].id, new Date()]

                        ];
                        connect.con.query(msg_transaction, [values], function (err, result1) {

                            if (err) {
                                reject("");
                            } else {
                                resolve(result1);
                            }
                        });
                    });
            });
    })



}
  var submit_transaction =  (sender_address, reciever_address, subject, message_id, attachment) => {
      console.log("attachment"+ attachment);
    return new Promise(function (resolve, reject) {
        // var sql = "insert into msg_transaction(`sender_address`, `reciever_address`,`subject`, `message_id`, `date_time`) VALUES ('" + sender_address + "', '" + reciever_address + "' ,'" + subject + "', " + message_id + ", now())";
        let sql = "insert into msg_transaction(`sender_address`, `reciever_address`,`subject`, `message_id`, `date_time`, `attachment`) VALUES ?";
        var values1 = new Array();

        for (let i = 0; i < reciever_address.length; i++) {
            let values = [sender_address.trim(), reciever_address[i].trim(), subject, message_id, new Date(), attachment];
            values1.push(values);
        }
         connect.con.query(sql, [values1], function (err, result) {
            if (err) {
                reject(err);
            } else {
                
               getMessageBody(message_id)
               .then((msg_content)=>{
                     messageTransaction(sender_address, reciever_address,subject, msg_content[0].message,attachment)
                     .then((msg_content1)=>{
                        resolve(result.affectedRows);
             
                  }).catch((err)=>{
                   console.log("Error on get message body"+err)
                  });
          
               }).catch((err)=>{
                console.log("Error on get message body"+err)
               });
            }

        });


    });

}
var getMessageBody = (id) => {
    let sqlQuery = "select message from ?? where id = ?";
    let table = ["msg_content", id];
    let query = mysql.format(sqlQuery, table);
    return commonFunction(query);
}
var getAttechmentName = (txnid)=>{
    let id = parseInt(txnid);
    let sqlQuery = "select attachment from ?? where id = ?";
    let table = ["msg_transaction", id];
    let query = mysql.format(sqlQuery, table);
    return commonFunction(query);
}
var msgContent = (sender_address, subject, message) => {
    return new Promise(function (resolve, reject) {

        var sql = "insert into msg_content(sender_address,  subject, message, date_time) values('" + sender_address + "','" + subject + "','" + message + "', now())";

        connect.con.query(sql, 'utf8', function (err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
                createMessage(result, message, subject);
            }
        });
    });
};

var insertUserModified = (ethadd, email, password, token) => {
    return new Promise(function (resolve, reject) {
        var sql = "insert into user(ether_address, email, password, token) values(" + mysql.escape(ethadd) + "," + mysql.escape(email) + "," + mysql.escape(password) + "," + mysql.escape(token) + ")";
        connect.con.query(sql, function (err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    })
}
var updateUserNew = (email, fullname, contact, reg_gender, img_name) => {
    return new Promise(function (resolve, reject) {
        let sqlQuery = "update user set full_name=" + mysql.escape(fullname) + ",contact =" + mysql.escape(contact) + " , gender=" + mysql.escape(reg_gender) + ", profile_pic=" + mysql.escape(img_name) + " where  email=" + mysql.escape(email) + "";
        connect.con.query(sqlQuery, function (err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    })
}
var updateUserModified = (ethadd, email, password, token) => {
    return new Promise(function (resolve, reject) {
        let sqlQuery = "update user set email= " + mysql.escape(email) + ", password=" + mysql.escape(password) + ", token=" + mysql.escape(token) + " where  ether_address=" + mysql.escape(ethadd) + "";
        connect.con.query(sqlQuery, function (err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    })
}
var updatePassword = (email, password) => {
    let sqlQuery = "update ?? set password=? where  email=?";
    let table = ["user", password, email];
    let query = mysql.format(sqlQuery, table);
    return commonFunction(query);
}

var lastLogin = (ether_address) => {
    let sqlQuery = "update ?? set last_login = now() where ether_address=?";
    let table = ["user", ether_address];
    let query = mysql.format(sqlQuery, table);
    return commonFunction(query);
}
var bdaqVerification = (email, token) => {
    let sqlQuery = "select email from ?? where email=? and token =?";
    let table = ["user", email, token];
    let query = mysql.format(sqlQuery, table);
    return commonFunction(query);
}

var setToken = (email, token) => {
    let sqlQuery = "update ??  set token = ? where email=?";
    let table = ["user", token, email];
    let query = mysql.format(sqlQuery, table);
    return commonFunction(query);
}
var verifyEmail = (email) => {
    let sqlQuery = "update ??  set email_varify = 1 where email=?";
    let table = ["user", email];
    let query = mysql.format(sqlQuery, table);
    return commonFunction(query);
}

var pagination = (ewa, limit, start) => {
   // let sqlQuery = "SELECT msg_transaction.id, msg_transaction.sender_address, msg_transaction.subject,msg_transaction.reciever_address, msg_content.message, msg_content.status, msg_transaction.date_time, msg_transaction.read_status, msg_transaction.delete_status FROM ?? LEFT JOIN `msg_content` ON msg_content.id = msg_transaction.message_id WHERE msg_transaction.reciever_address =? and msg_transaction.delete_status =0 ORDER BY msg_transaction.date_time DESC LIMIT " + limit + " OFFSET " + start + "";
    let sqlQuery = "SELECT msg_transaction.id, msg_transaction.sender_address, msg_transaction.subject,msg_transaction.reciever_address, msg_content.message, msg_content.status, msg_transaction.date_time, msg_transaction.read_status, msg_transaction.delete_status, msg_transaction.attachment FROM ?? LEFT JOIN `msg_content` ON msg_content.id = msg_transaction.message_id WHERE msg_transaction.reciever_address =? and msg_transaction.delete_status =0 ORDER BY msg_transaction.date_time DESC";
    let table = ["msg_transaction", ewa, limit, start];
    let query = mysql.format(sqlQuery, table);
    return commonFunction(query);
}

var commonFunction = (query) => {
    return new Promise(function (resolve, reject) {
        connect.con.query(query, function (err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result);

            }
        });
    });
}

//message submission
async function messageTransaction(senderAdd, receiverAdd, subject, message,attachment) {
    try {
        var conn = await connection.connect(adminCard);
        var factory = await conn.getFactory();
        var msgTxn = await factory.newTransaction("org.messaging.network", "MessageExchange");
        var msgsub = await factory.newRelationship("org.messaging.network", "Message", subject);
        var msg = await factory.newRelationship("org.messaging.network", "Message", message);
        var attached = await factory.newRelationship("org.messaging.network", "Message", attachment);
        var sender = await factory.newRelationship("org.messaging.network", "User", senderAdd);
        var receiver = await factory.newRelationship("org.messaging.network", "User", receiverAdd);
        msgTxn.subject = msgsub;
        msgTxn.message = msg;
        msgTxn.attachment = attached;
        msgTxn.sender = sender;
        msgTxn.receiver = receiver;
        await connection.submitTransaction(msgTxn);
        await connection.disconnect();
        //console.log("Submitted to chain");
    } catch (error) {
        await connection.disconnect();
        console.log(error);

    }
}

//message creation for blockchain

async function createMessage(msg, message, subject) {
    try {
        var conn = await connection.connect(adminCard);
        var factory = await conn.getFactory();
        var msgTxn = await factory.newTransaction("org.messaging.network", "NewMessage");
        msgTxn.messageId = msg.insertId.toString();
        msgTxn.content = message;
        msgTxn.subject = subject;
        await connection.submitTransaction(msgTxn);
       // await connection.disconnect();
       // console.log("Success...............!");
    } catch (error) {
        await connection.disconnect();
        console.log(error);

    }
}

//Select Message from block chain
async function getMessageData(){
    const connection = new BusinessNetworkConnection();
    const definition = await connection.connect(adminCard);
    
return await definition.getHistorian();

}

var saveToDraft = (req, res) =>{
   let sender_address = req.body.senderAdd;
   let subject = req.body.subject;
   let message = req.body.message;
   let sqlQuery = "insert into ??(sender_address,  subject, message, date_time, draft) values(?,?,?, now(),1)";
   let table = ["msg_content", sender_address, subject, message];
   let query = mysql.format(sqlQuery, table);
   return commonFunction(query);
     
}

var getDraft = (ewa) =>{
    let sqlQuery = "select * from ?? where sender_address = ? and draft =1 and delete_draft = 0 ORDER BY date_time DESC";
    let table = ["msg_content", ewa];
    let query = mysql.format(sqlQuery, table);
    return commonFunction(query);
}
module.exports = {
    validate_secured_login,//validate secure user
    validate_unsecured_login,//validate unsured
    userMessage,//Show all user message
    delete_usermsg,//Delete user message
    markasread,//Mark as read of user message
    markasunread,//Mark as unread
    submitFirstTransaction,//Send Admin message
    submit_transaction,//Transaction add to table
   // submit_transaction_doc,
    msgContent,//Message content
    create_user,// Create user
    isAvailable,//check user ewa
    validateLogin,//validate Login
    userSendMessage,//Send user message
    updatePassword,// Reset user password
    countMessage,//Count Total message
    lastLogin,//Last Login time
    bdaqVerification,//Email verification
    setToken,//Set token
    verifyEmail,//verify email
    pagination,//Pagination
    delete_send,//delete send
    updateUserModified,//Update user
    insertUserModified,//insert user
    updateUserNew,
    getMessageData,
    getAttechmentName,
    validate_secured_email,
    saveToDraft,
    getDraft
};
