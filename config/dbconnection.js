var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123456",
    database: "btmessaging"
},function(err, result){
    if(result){
        console.log("database connected");
    }else{
        console.log("Can't  connect to database"+err); 
    }
});
module.exports={
    con,
};

// host: "localhost",
// user: "root",
// password: "",
// database: "msg_app_data"