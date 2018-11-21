var nodemailer = require('nodemailer');

//--------------------------------------------------------
// Declarations    
//--------------------------------------------------------
var senderEmail = 'arun@blocktitans.in';
var password = 'Arun$123';
var service = 'Godaddy';
//--------------------------------
// Mail Sending Email
//--------------------------------------------------------
var transporter = nodemailer.createTransport({
    service: service,
    auth: {
        user: senderEmail,
        pass: password
    }
});

    // ================================================================
    // handle Sendmail
    // ================================================================

    var sendEMail =(emailId, subject, mailcontent)=> {
        let mailOptions = {
            from: senderEmail,
            to: emailId,
            subject: subject,
            html: mailcontent
        };
        return new Promise(function (resolve, reject) {
           transporter.sendMail(mailOptions, function (err, info) {
                if (err) {
                    reject(err);
                } else {
                    resolve(info);
                }
            });
            
        });
    }
     var sendEMails = async (emailId, subject, mailcontent)=> {
        let mailOptions = {
            from: senderEmail,
            to: emailId,
            subject: subject,
            html: mailcontent
        };
      
           transporter.sendMail(mailOptions, function (err, info) {
                if (err) {
                    reject(err);
                } else {
                    resolve(info);
                }
            });
            
      
    }


//--------------------------------------------------------
// Exporting All functions
//--------------------------------------------------------
   
module.exports = {
    transporter,
    senderEmail,
    sendEMail,
    sendEMails
}