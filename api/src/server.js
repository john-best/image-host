'use strict'

var express = require('express');
var bodyparser = require('body-parser');
var multer = require('multer');
var path = require('path');
var crypto = require('crypto');
var jsonwebtoken = require('jsonwebtoken');

var app = express();
var router = express.Router();
var port = process.env.API_PORT || 8421;
var jwt_secret = "helpineedaninternship";

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

// image handling
var upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        let ext = path.extname(file.originalname);
        if (ext !==  '.jpg' &&  ext !== '.jpeg' && ext !== '.png' && ext !== '.gif') {
            return cb(null, false); 
        }
        cb(null, true);
    },
    limits: { fileSize: 1048576 } // 5MB
});


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

// middleware for checking token
app.use(function(req, res, next) {
    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] == 'JWT') {
        jsonwebtoken.verify(req.headers.authorization.split(' ')[1], jwt_secret, function(err, out) {
            if (err) { req.user = undefined; }
            else { req.user = out; }

            next();
        });
    } else {
        req.user = undefined;
        next();
    }
});


require('./routes.js')(app, router, upload, jwt_secret);

app.use('/api', router);

app.listen(port, function() {
    console.log(`API started... listening on port ${port}`);
});
