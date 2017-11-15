'use strict'

var express = require('express');
var mongoose = require('mongoose');
var bodyparser = require('body-parser');
var multer = require('multer');

var app = express();
var router = express.Router();
var port = process.env.API_PORT || 8421;
var upload = multer({ dest: 'uploads/' })


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
    // TODO: var image is already uploaded at this point... read more documentation to sanitize this before writing to disk
    console.log(req.query);
    console.log(req.file);
});


app.use('/api', router);

app.listen(port, function() {
    console.log(`API started... listening on port ${port}`);
});
