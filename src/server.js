'use strict'

var express = require('express');
var bodyparser = require('body-parser');
var multer = require('multer');
var path = require('path');
var crypto = require('crypto');
var passport = require('passport');
var cookieParser = require('cookie-parser');

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

// auth/session stuff
app.use(cookieParser())
//app.use(session({ secret: 'helpineedaninternship' }));
app.use(passport.initialize());
app.use(passport.session());

require('./routes.js')(app, router, passport, upload);

app.use('/api', router);

app.listen(port, function() {
    console.log(`API started... listening on port ${port}`);
});
