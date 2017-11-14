'use strict'

var express = require('express');
var mongoose = require('mongoose');
var bp = require('body-parser');

var app = express();
var router = express.Router();

var port = process.env.API_PORT || 8421;


// accept json data
app.use(bp.urlencoded({ extended: true }));
app.use(bp.json());

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
    res.json({ message: 'Welcome to the API!' });
});


router.get('/upload', function(req, res) {
    res.json({ message: 'Error: You must call POST on upload' });
});

router.post('/upload', function(req, res) {
    res.json(req.query);
    console.log(req.query);
});


app.use('/api', router);

app.listen(port, function() {
    console.log(`API started... listening on port ${port}`);
});
