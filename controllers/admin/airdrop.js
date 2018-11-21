
const Web3 = require('web3');
const web3 = new Web3();
var csv = require("fast-csv");
var fs = require('fs');
var Tx = require('ethereumjs-tx');
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
var Request = require("request");
const connection = require('../../config/dbconnection');
const emailConfig = require('../../config/emailconfig');
const mailContent = require('../../controllers/common/emailContent');
var BATCH_SIZE = 80;
var distribData = new Array();
var distribTokenData = new Array();
var allocData = new Array();
var allocTokenData = new Array();
const polyDistributionArtifacts = require('../../build/contracts/TokenAirdrop.json');
const polyTokenArtifacts = require('../../build/contracts/BDQToken.json');
var tokenAirdropAddress = "0x823c3f4a26af542bc2e83d270e325208e829a068";
var contractAdd = "0x178bfD1b069B10CB9aaa02E23C2F6Ec4553d5461";
exports.airdrop = function (req, res) {
  if (req.method == "POST") {
    console.log("::::::::::::::::::;;inside airdrop");
    hostAddress = req.protocol + '://' + req.get('host');
    var errormessage = [];
    var succmessage = [];
    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    var csvfile = req.files.csvfile;
    //console.log("files:::::::::::" + csvfile.name);
    var csvfileStr = csvfile.name.split('.');
    var csvfileName = 'airdrop_csvfile_' + new Date().getTime() + '.' + csvfileStr[1];
    //var filePath = '../../ '+csvfileName;
    var filePath = 'public/csv/' + csvfileName;
    csvfile.mv(filePath, function (err) {

      if (err) console.log("Error during upload:::" + err);//return res.status(500).send(err);

      readFile(csvfileName, filePath);

    });
  } else {
    res.render('admin/airdrop');
  }
}

function readFile(csvfileName, filePath) {
  var stream = fs.createReadStream(filePath);

  let index = 0;
  let batch = 0;
  console.log(`
    --------------------------------------------
    --------- Parsing distrib.csv file ---------
    --------------------------------------------
  `);

  var csvStream = csv()
    .on("data", function (data) {
     // console.log(data.length+"###########data.length");
      if (/*isAddress &&*/ data[0] != null && data[0] != '' && data[0] != 'EWA' && data[1] != 'Token') {
        allocData.push(data[0]);
        allocTokenData.push(data[1]);
     
        index++;
        if (index >= BATCH_SIZE) {
          distribData.push(allocData);
          distribTokenData.push(allocTokenData);
          allocData = [];
          allocTokenData = [];
          index = 0;
        }
      }
    })
    .on("end", function () {
      //Add last remainder batch
      distribData.push(allocData);
      distribTokenData.push(allocTokenData);
      allocData = [];
      allocTokenData = [];
      setAllocation();
    });
  stream.pipe(csvStream);
}



async function setAllocation() {
  console.log(`
    --------------------------------------------
    ---------Performing allocations ------------
    --------------------------------------------
  `);
  const privateKey = '0xc2601e18bd58021a519345cac8ab7fc5adc8500096b722b63c58d496ecaafb99';
  web3.setProvider(new web3.providers.HttpProvider('https://ropsten.infura.io/xAugtHoCe1zIDPR4YqE3'));
  let fromAccount = '0x8293189792A62F4AEc8233d25814E695aa03392e';
  let inc = 1;
  let encodedABI;
  let nonce;
  contract = new web3.eth.Contract(polyDistributionArtifacts.abi, tokenAirdropAddress);
  //console.log(distribData.length+"distribData.length");
  for (var i = 0; i < distribData.length; i++) {
    const query = contract.methods.addAirdrop(distribData[i], distribTokenData[i]);

    encodedABI = query.encodeABI();
    const tx = {
      //  nonce: '0x' + nonce,
      from: fromAccount,
      to: tokenAirdropAddress,
      gas: 4500000,
      gasPrice: 50000000000,
      data: encodedABI,
    };
    inc = inc + 1;
    web3.eth.accounts.signTransaction(tx, privateKey).then(signed => {
      const tran = web3.eth
        .sendSignedTransaction(signed.rawTransaction)
        .on('receipt', receipt => {
         // console.log('=> reciept');
         // console.log(distribData[i] + ";;;;;;;;;;;;;;;;;;;;;;;;");
          let sqlQuery = "select email from user where ether_address IN(?)";
        connection.con.query(sqlQuery,[distribData[i]], function (err, result) {
            if (result) {
              for (let j = 0; j < result.length; j++) {
                 emailConfig.sendEMail(result[j].email, "Bdaq information", mailContent.tokenDistributionInfo(fromAccount, contractAdd))
                .then(function(mail){
                  console.log("Mail send to :"+result[j].email);
                  
                }).catch(function(err){
                  console.log("Error on send mail"+err);
                })
              }
            }

          });

        })
        .on('error', console.error);
    });
    // console.log(":::::::::::::::::::::before delay");
    await delay(90000);
    //console.log(":::::::::::::::::::::after delay");

  }
  console.log("Airdrop script finished successfully.")

}