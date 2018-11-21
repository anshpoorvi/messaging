var crypto = require('crypto');
var fs = require('fs');

// change the algo to sha1, sha256 etc according to your requirements
var algo = 'md5';
var shasum = crypto.createHash(algo);

var file = './public/images/1.jpg';
var s = fs.ReadStream(file);
s.on('data', function(d) { shasum.update(d); });
s.on('end', function() {
    var d = shasum.digest('hex');
    console.log(d);
});