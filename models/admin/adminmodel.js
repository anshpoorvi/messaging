//----------------------------------------------------//
//-------------------- Import ------------------------//
//----------------------------------------------------//
const mysql = require('../../config/dbconnection');
var mysql1 = require('mysql');

var adminInbox = () => {

    return new Promise(function (resolve, reject) {
        let sql = "select * from msg_content order by id DESC";
        mysql.con.query(sql, function (err, result) {
            if (err) {
                reject("can't show admin inbox");
            } else {
                resolve(result);
            }

        });
    });

}
var adminInboxPagination = (pageno) => {
    return new Promise(function (resolve, reject) {
        let sql = "select * from user where role='user' LIMIT 5 OFFSET ?";
        mysql.con.query(sql,pageno, function (err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }

        });
    });

}
var blockUser = (etherAddress) => {
    var msg_transaction = "update msg_transaction set delete_status = 1 where reciever_address=?";
    mysql.con.query(msg_transaction, etherAddress, function (err, transactionResult) { });
    return new Promise(function (resolve, reject) {
        let sql = "update user set active = 0 where ether_address=?";
        mysql.con.query(sql, etherAddress, function (err, result) {
            if (err) {
                reject("1 Can not block this user");
            } else {
                resolve(result);
            }


        });
    });

}
var unblockUser = (etherAddress) => {
    var msg_transaction = "update msg_transaction set delete_status = 0 where reciever_address=?";
    mysql.con.query(msg_transaction, etherAddress, function (err, transactionResult) { });
    return new Promise(function (resolve, reject) {
        let sql = "update user set active = 1 where ether_address=?";
        mysql.con.query(sql, etherAddress, function (err, result) {
            if (err) {
                reject("1 Can not block this user");
            } else {
                resolve(result);
            }
        });
    });

}
var rearchUsers = (userName, status) => {
    let rearchUsers = "select * from ?? where  active=? and full_name  LIKE ?";
    let table = ["user", status, userName];
    let query = mysql1.format(rearchUsers, table);
    return commonFunction(query);
}
var rearchAllUsers = (userName) => {
    let rearchUsers = "select * from ?? where email  LIKE ? '%'";
    let table = ["user", userName];
    let query = mysql1.format(rearchUsers, table);
    return commonFunction(query);
}
var changeMessageStatus = (status, id) => {
    let rearchUsers = "update ?? set status = ? where id = ?";
    let table = ["msg_content", status, id];
    let query = mysql1.format(rearchUsers, table);
    return commonFunction(query);
}
var totalUser = () => {
    let rearchUsers = "select * from ?? where role='user'";
    let table = ["user"];
    let query = mysql1.format(rearchUsers, table);
    return commonFunction(query);
}
var airDropList = () => {
    let rearchUsers = "select ether_address, '2000000000000000000' as Token from ?? where role='user' and secure= 0 and email_varify = 1";
    let table = ["user"];
    let query = mysql1.format(rearchUsers, table);
    return commonFunction(query);
}
var commonFunction = (query) => {
    return new Promise(function (resolve, reject) {
        mysql.con.query(query, function (err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result);

            }
        });
    });
}
var sponsored = (sender_address,subject, message) => {
    return new Promise(function (resolve, reject) {
        let adminTransaction = "insert into msg_content(`sender_address`, `subject`, `message`, `date_time`) VALUES ('"+sender_address+"', '" + subject + "' ,'" + message + "', now())";
        mysql.con.query(adminTransaction, function (err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}
var alluserData=(req, res) =>{     
    //To calculate Total Count use MySQL count function
    var query = "select count(*) as TotalCount from ??"; 
    // Mention table from where you want to fetch records example-users
    var table = ["user"]; 
    query = mysql1.format(query, table);
    mysql.con.query(query, function(err, rows) {
    if(err){
     return err;
    }else{   
    //store Total count in variable
    var totalCount = rows[0].TotalCount
    console.log("Total count "+totalCount);
    if(req.body.start == '' || req.body.limit == ''){
       var startNum = 0;
       var LimitNum = 10;
     }  
    else{
       //parse int Convert String to number 
        var startNum = parseInt(req.params.start);
        var LimitNum = parseInt(req.params.limit);
     }
    }
    var query = "select * from ?? ORDER BY id DESC limit ? OFFSET ?";
    //Mention table from where you want to fetch records example-users & send limit and start 
    var table = ["user",LimitNum,startNum];
    query = mysql1.format(query, table);
    mysql.con.query(query, function(err, rest) {
    if(err){
    console.log("Error"+err)
    }
    else{
        
        console.log(rest[0].email);
    }
    });
    }); 
    }
module.exports = {
    adminInbox,//Get Admin Dashboard
    blockUser,//Block Users by admin
    unblockUser,//unblock Users by admin
    rearchUsers,//Search Perticular Users by admin
    rearchAllUsers,//Search all Users by admin
    changeMessageStatus,//Search Perticular Users by admin
    totalUser,// Get all users
    sponsored,//sponsored message sending
    airDropList ,
    adminInboxPagination,
    alluserData
};