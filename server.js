var express = require('express');    //Express Web Server 
var busboy = require('connect-busboy'); //middleware for form/file upload
var path = require('path');     //used for file path
var fs = require('fs-extra');       //File System - for file manipulation

var app = express();
app.use(busboy());
app.use(express.static(path.join(__dirname, 'public')));

/* ========================================================== 
Create a Route (/upload) to handle the Form submission 
(handle POST requests to /upload)
Express v4  Route definition
============================================================ */
app.route('/upload')
    .post(function (req, res, next) {

        var fstream;
        req.pipe(req.busboy);
        req.busboy.on('file', function (fieldname, file, filename) {
            console.log("Uploading: " + filename);

            //Path where image will be uploaded
            fstream = fs.createWriteStream(__dirname + '/img/' + filename);
            file.pipe(fstream);
            fstream.on('close', function () {    
                console.log("Upload Finished of " + filename);              
                res.redirect('back');           //where to go next
            });
        });
    });

var server = app.listen(3030, function() {
    console.log('Listening on port %d', server.address().port);
});
INDEX.HTML

<!DOCTYPE html>
<html lang="en" ng-app="APP">
<head>
    <meta charset="UTF-8">
    <title>angular file upload</title>
</head>

<body>
        <form method='post' action='upload' enctype="multipart/form-data">
        <input type='file' name='fileUploaded'>
        <input type='submit'>
 </body>
</html>
The following will work with formidable SERVER.JS

var express = require('express');   //Express Web Server 
var bodyParser = require('body-parser'); //connects bodyParsing middleware
var formidable = require('formidable');
var path = require('path');     //used for file path
var fs =require('fs-extra');    //File System-needed for renaming file etc

var app = express();
app.use(express.static(path.join(__dirname, 'public')));

/* ========================================================== 
 bodyParser() required to allow Express to see the uploaded files
============================================================ */

//upload file
app.use(bodyParser({defer: true}));
 app.route('/upload')
 .post(function (req, res, next) {

  var form = new formidable.IncomingForm();
    //Formidable uploads to operating systems tmp dir by default
    form.uploadDir = "./img";       //set upload directory
    form.keepExtensions = true;     //keep file extension

    form.parse(req, function(err, fields, files) {
        res.writeHead(200, {'content-type': 'text/plain'});
        res.write('received upload:\n\n');
        console.log("form.bytesReceived");
        //TESTING
        console.log("file size: "+JSON.stringify(files.fileUploaded.size));
        console.log("file path: "+JSON.stringify(files.fileUploaded.path));
        console.log("file name: "+JSON.stringify(files.fileUploaded.name));
        console.log("file type: "+JSON.stringify(files.fileUploaded.type));
        console.log("astModifiedDate: "+JSON.stringify(files.fileUploaded.lastModifiedDate));

        //Formidable changes the name of the uploaded file
        //Rename the file to its original name
        fs.rename(files.fileUploaded.path, './img/'+files.fileUploaded.name, function(err) {
        if (err)
            throw err;
          console.log('renamed complete');  
        });
          res.end();
    });
});

// START THE SERVER
// ==============================================
app.listen(port);
console.log('Magic happens on port ' + port);
