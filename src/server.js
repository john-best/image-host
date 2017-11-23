'use strict'

var express = require('express');
var bodyparser = require('body-parser');
var multer = require('multer');
var path = require('path');
var crypto = require('crypto');
var fs = require('fs');

var app = express();
var router = express.Router();
var port = process.env.API_PORT || 8421;


// image hold
var storage = multer.diskStorage({
    destination: 'images/',
    filename: function(req, file, cb) {
        crypto.pseudoRandomBytes(16, function(err, raw) {
            if (err) return cb(err);

            cb(null, raw.toString('hex') + path.extname(file.originalname));
        })
    }
});
var upload = multer({ storage: storage })


// accept json data
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

// avoid x-origin resource sharing errors
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');

    next();
});


// api
router.get('/', function(req, res) {
    res.redirect('..');
});

router.get('/upload', function(req, res) {
    res.json({ message: 'Error: You must call POST on upload' });
});

router.post('/upload', upload.single('image'), function(req, res) {
    // TODO: mimetype check (extension-only check is unsafe)
    console.log(req.file);
    //res.json(req.file);
    res.redirect('/api/' + req.file.filename);
});

router.get('/:image_url', function(req, res) {
    var image_path = __dirname + '/../images/' + req.params.image_url;
   
    if (fs.existsSync(image_path)) {
        res.sendFile(path.join(image_path));
    } else {
        res.json({message: "Error: File not found!"});
    }
});

app.use('/api', router);

app.listen(port, function() {
    console.log(`API started... listening on port ${port}`);
});
