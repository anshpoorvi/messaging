'use strict';
var app = require('./app');
var CronJob = require('cron').CronJob;
var Request = require("request");
const connection = require('./config/dbconnection');

console.log("-----------environment="+process.env.NODE_ENV);
console.log("-----------port="+process.env.PORT);

var environment = process.env.NODE_ENV || 'development';

if (environment != "development") {
    console.log("-----------production");
    var debug = require('debug')('https-server');
    var https = require('https');
    var http = require('http');
    var fs = require("fs");
   // var successewa = [];
    http.createServer(app).listen(80);
    https.createServer(app).listen(443);
} else {
    var port = process.env.PORT ||4343;
    app.listen(port, function () {
        console.log('Server listening on port ' + port + '...');
    });
}


    // new CronJob('*/5 * * * *', function() {
    //     console.log("Batch job started::::");
    //     let selectSql = "select max(block_number) as blockCount from transaction";
    //     let selectQuery = connection.con.query(selectSql, function(err, result) {
           
    //         let startBlock = 0;
    //         if(null != result[0].blockCount){
    //             startBlock = result[0].blockCount + 1;
    //         }
    //        // console.log(":::::startCount"+startBlock);
    //         var url = "http://api-ropsten.etherscan.io/api?module=account&action=tokentx&address=0x8293189792A62F4AEc8233d25814E695aa03392e&startblock="+startBlock+"&endblock=999999999&sort=asc&apikey=EQPV9W3UGYK4EK19NHH9797HAUW8Q5IVTJ";
    //        // console.log(url);
    //         Request.get(url, function(error, response, body){
    //             if(error) {
    //                 return console.dir(":::::::::::::::::failure"+error);
    //             }
    //             let results = JSON.parse(body);
    //             if(null != results.result){
    //             var total = results.result.length;
    //             var records = [];
    //             var record = [];
    //             for(let i=0 ; i < total ; i++){
    //                 record.push(results.result[i].hash, results.result[i].blockNumber, results.result[i].nonce, results.result[i].from, results.result[i].to, results.result[i].value, results.result[i].tokenName, results.result[i].tokenSymbol, results.result[i].gas, results.result[i].gasUsed, results.result[i].gasPrice, results.result[i].timeStamp);
    //                 records.push(record);
    //                 var sql = "INSERT INTO transaction (tx_hash, block_number, nonce, from_address, to_address, value, tokenName, tokenSymbol, gas, gas_used, gas_price, timestamp) VALUES ?";
    //                 var query = connection.con.query(sql, [records], function(err, result) {
    //                     if(err) console.log(err);
    //                 });
    //                 record = [];
    //                 records = [];
    //                console.log(":::::::::::To address:::::::::::::"+results.result[i].to);
    //             }
    //             }
    //             console.log("----completed-------");
    //         });
    //     });
    //     console.log("successfully done");
       
        
    // }, null, true, 'America/Los_Angeles');