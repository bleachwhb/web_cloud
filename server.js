
// var redis = require('redis');
var express = require('express');
var http = require('http');
var app = express();
// var client = redis.createClient();
var fs = require("fs");

app.use(express.static('public'));

app.listen(8080, function(){
    console.log('app listening on port 8080');
});

app.get('*', function(req, res) {
    res.sendFile(__dirname + '/public/index.html'); // load our public/index.html file
});

// client.on('connect', function() {
//     console.log('connected');
// });

exports = module.exports = app;