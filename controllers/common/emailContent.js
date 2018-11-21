

var resetMsgContent = (webUrl, email, token) => {
    let mailcontent = `
                                                       
<body style="font-family: 'Roboto', sans-serif;margin: 20px;">
<!-- HEADER -->
<table style="width: 100%;background: #242424;">
    <tr>
        <td></td>
        <td>
            <div>
                <table>
                    <tr>
                        <td><img src="http://blocktitans.in/wp-content/uploads/2018/04/cropped-Block-Titans-Logo.png" style="width: 200px;text-align: center;display: block;padding: 10px 0;" /></td>
                    </tr>
                </table>
            </div>
        </td>
        <td></td>
    </tr>
</table>
<!-- /HEADER -->
<!-- BODY -->
<div style="
background: #009dff05;
'box-shadow: #f9f9f9;
box-shadow: 5px 10px #888888;
-webkit-box-shadow: -1px 2px 29px -9px rgba(0,0,0,0.75);
-moz-box-shadow: -1px 2px 29px -9px rgba(0,0,0,0.75);
box-shadow: -1px 2px 29px -9px rgba(0,0,0,0.75);
padding: 10px 0;
">
    <div style="padding: 0 20px;color: #555;">
        <h3>Hi, </h3>
        <p>It's look like you requested a new password.</p>
        <p>If that sounds right, you can enter new password by clicking on the button below.</p>

        <div style="display: block;padding: 20px 0;">
            <a href="${webUrl}/resetpassword/${email}/${token}" style="background: #009dff;padding: 15px;text-decoration: none;color: #fff;margin: 20px 0;" title="Reset password">Reset Password</a>
           
        </div>
        <p style="font-size: 14px;">This link will be valid for the next 1 hours.</p>
    </div>
    <div style="background: #c3c3c3;padding: 3px;text-align: center;font-size: 14px;color: #555;">
        <p>This email has been sent to you because you have an account on <a href="#" title="EtherMail.com" style="color: #555;">EtherMail.com</a></p>
    </div>

    <!-- /BODY -->

    <!-- FOOTER -->
    <div style="text-align: center;color: #888;padding-top: 10px;">
        <a href="#" style="color: #242424;font-size: 14px;text-decoration:none;" title="Terms">Terms</a> |
        <a href="#" style="color: #242424;font-size: 14px;text-decoration:none;" title="Privacy">Privacy</a> |
        <a href="#" style="color: #242424;font-size: 14px;text-decoration:none;" title="Unsubscribe">
            <unsubscribe>Unsubscribe</unsubscribe>
        </a>
    </div>
    <!-- /FOOTER -->

</body>
     `;


    return mailcontent
}
var confirmMsgContent = (webUrl, email, token) => {
    let mailcontent = `
                                                       
<body style="font-family: 'Roboto', sans-serif;margin: 20px;">
<!-- HEADER -->
<table style="width: 100%;background: #242424;">
    <tr>
        <td></td>
        <td>
            <div>
                <table>
                    <tr>
                        <td><img src="http://blocktitans.in/wp-content/uploads/2018/04/cropped-Block-Titans-Logo.png" style="width: 200px;text-align: center;display: block;padding: 10px 0;" /></td>
                    </tr>
                </table>
            </div>
        </td>
        <td></td>
    </tr>
</table>
<!-- /HEADER -->
<!-- BODY -->
<div style="
background: #009dff05;
'box-shadow: #f9f9f9;
box-shadow: 5px 10px #888888;
-webkit-box-shadow: -1px 2px 29px -9px rgba(0,0,0,0.75);
-moz-box-shadow: -1px 2px 29px -9px rgba(0,0,0,0.75);
box-shadow: -1px 2px 29px -9px rgba(0,0,0,0.75);
padding: 10px 0;
">
    <div style="padding: 0 20px;color: #555;">
        <h3>Welcome, ${email} </h3>
        <p>It's look like you requested a new account.</p>
        <p>If that sounds right, you can confirm the account by clicking on button below.</p>
       
        <div style="display: block;padding: 20px 0;">
            <a href="${webUrl}/bdaqverification/${email}/${token}" style="background: #009dff;padding: 15px;text-decoration: none;color: #fff;margin: 20px 0;" title="Confirm Account">Confirm Account</a>
        </div>
        <p style="font-size: 14px;">This link will be valid for the next 1 hours.</p>
    </div>
    <div style="background: #c3c3c3;padding: 3px;text-align: center;font-size: 14px;color: #555;">
        <p>This email has been sent to you because you have an account on <a href="#" title="ethermail.com" style="color: #555;">EtherMail.com</a></p>
    </div>

    <!-- /BODY -->

    <!-- FOOTER -->
    <div style="text-align: center;color: #888;padding-top: 10px;">
        <a href="#" style="color: #242424;font-size: 14px;text-decoration:none;" title="Terms">Terms</a> |
        <a href="#" style="color: #242424;font-size: 14px;text-decoration:none;" title="Privacy">Privacy</a> |
        <a href="#" style="color: #242424;font-size: 14px;text-decoration:none;" title="Unsubscribe">
            <unsubscribe>Unsubscribe</unsubscribe>
        </a>
    </div>
    <!-- /FOOTER -->

</body>


     `;


    return mailcontent
}

var tokenDistributionInfo = (ewa, contractAdd) => {
    let mailcontent = `
                                                       
<body style="font-family: 'Roboto', sans-serif;margin: 20px;">
<!-- HEADER -->
<table style="width: 100%;background: #242424;">
    <tr>
        <td></td>
        <td>
            <div>
                <table>
                    <tr>
                        <td><img src="http://blocktitans.in/wp-content/uploads/2018/04/cropped-Block-Titans-Logo.png" style="width: 200px;text-align: center;display: block;padding: 10px 0;" /></td>
                    </tr>
                </table>
            </div>
        </td>
        <td></td>
    </tr>
</table>
<!-- /HEADER -->
<!-- BODY -->
<div style="
background: #009dff05;
'box-shadow: #f9f9f9;
box-shadow: 5px 10px #888888;
-webkit-box-shadow: -1px 2px 29px -9px rgba(0,0,0,0.75);
-moz-box-shadow: -1px 2px 29px -9px rgba(0,0,0,0.75);
box-shadow: -1px 2px 29px -9px rgba(0,0,0,0.75);
padding: 10px 0;
">
    <div style="padding: 0 20px;color: #555;">
        <h3>Hi,</h3>
        <p>It's look like you requested a secured account.</p>
        <p>If that sounds right, you can confirm the account by following step.</p>
        <ul>
            <li>We have been send 2 tokens on your register EWA. </li>
            <li>Please send one token back on EWA: <b>${ewa}</b></li>
            <li>Contract Address : <b>${contractAdd}</b></li>
        </ul>
      <p><strong>Note: </strong>You will be able to login after 10 min of send one token back successfully.</p>
    </div>
    <div style="background: #c3c3c3;padding: 3px;text-align: center;font-size: 14px;color: #555;">
        <p>This email has been sent to you because you have an account on <a href="#" title="ethermail.com" style="color: #555;">EtherMail.com</a></p>
    </div>

    <!-- /BODY -->

    <!-- FOOTER -->
    <div style="text-align: center;color: #888;padding-top: 10px;">
        <a href="#" style="color: #242424;font-size: 14px;text-decoration:none;" title="Terms">Terms</a> |
        <a href="#" style="color: #242424;font-size: 14px;text-decoration:none;" title="Privacy">Privacy</a> |
        <a href="#" style="color: #242424;font-size: 14px;text-decoration:none;" title="Unsubscribe">
            <unsubscribe>Unsubscribe</unsubscribe>
        </a>
    </div>
    <!-- /FOOTER -->

</body>


     `;
    return mailcontent
}

var securedSuccessInfo = (fullname) => {
    let mailcontent = `
                                                       
<body style="font-family: 'Roboto', sans-serif;margin: 20px;">
<!-- HEADER -->
<table style="width: 100%;background: #242424;">
    <tr>
        <td></td>
        <td>
            <div>
                <table>
                    <tr>
                        <td><img src="http://blocktitans.in/wp-content/uploads/2018/04/cropped-Block-Titans-Logo.png" style="width: 200px;text-align: center;display: block;padding: 10px 0;" /></td>
                    </tr>
                </table>
            </div>
        </td>
        <td></td>
    </tr>
</table>
<!-- /HEADER -->
<!-- BODY -->
<div style="
background: #009dff05;
'box-shadow: #f9f9f9;
box-shadow: 5px 10px #888888;
-webkit-box-shadow: -1px 2px 29px -9px rgba(0,0,0,0.75);
-moz-box-shadow: -1px 2px 29px -9px rgba(0,0,0,0.75);
box-shadow: -1px 2px 29px -9px rgba(0,0,0,0.75);
padding: 10px 0;
">
    <div style="padding: 0 20px;color: #555;">
        <h3>Hi, ${fullname} </h3>
        <p>This is inform you that your account has been secured successfully.</p>
        <p>We have send a  temporary password with this mail, reset this password and enjoy the secure messaging.</p> 
        <p>Your temporary password is :</p>    
        <div style="display: block;padding: 20px 0;">
            <a href="/common/reset" style="background: #009dff;padding: 15px;text-decoration: none;color: #fff;margin: 20px 0;" title="Reset Password">Reset Password</a>
        </div>
      
    </div>
    <div style="background: #c3c3c3;padding: 3px;text-align: center;font-size: 14px;color: #555;">
        <p>This email has been sent to you because you have an account on <a href="#" title="ethermail.com" style="color: #555;">EtherMail.com</a></p>
    </div>

    <!-- /BODY -->

    <!-- FOOTER -->
    <div style="text-align: center;color: #888;padding-top: 10px;">
        <a href="#" style="color: #242424;font-size: 14px;text-decoration:none;" title="Terms">Terms</a> |
        <a href="#" style="color: #242424;font-size: 14px;text-decoration:none;" title="Privacy">Privacy</a> |
        <a href="#" style="color: #242424;font-size: 14px;text-decoration:none;" title="Unsubscribe">
            <unsubscribe>Unsubscribe</unsubscribe>
        </a>
    </div>
    <!-- /FOOTER -->

</body>


     `;


    return mailcontent
}

module.exports = {
    resetMsgContent,
    confirmMsgContent,
    tokenDistributionInfo,
    securedSuccessInfo
}