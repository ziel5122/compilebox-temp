/*
        *File: app.js
        *Author: Asad Memon / Osman Ali Mian
        *Last Modified: 5th June 2014
        *Revised on: 30th June 2014 (Introduced Express-Brute for Bruteforce protection)
*/

//packages
var exec = require('child_process').exec;
var jsdiff = require('diff');
var express = require('express');
var ExpressBrute = require('express-brute');
var fs = require('fs');

//local js files
var arr = require('./compilers');
var sandBox = require('./DockerSandbox');
var sandBoxMin = require('./DockerSandboxMin');

//create server on port (port)
var app = express.createServer();
var port = 80;

var store = new ExpressBrute.MemoryStore(); // stores state locally, don't use this in production
var bruteforce = new ExpressBrute(store,
    {
        freeRetries: 50,
        lifetime: 3600
    }
);

app.use(express.static(__dirname));
app.use(express.bodyParser());

app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
});

function random(size) {
    //returns a crypto-safe random
    return require("crypto").randomBytes(size).toString('hex');
}


app.post('/grade', bruteforce.prevent, function(req, res) {
    var hw_type = req.body.type
    var content = req.body.content;
    var hw_num = req.body.hw_num;

    var wdir = __dirname + "/"; //current working path
    var folder = 'temp/' + random(10); //folder in which the temporary file will be saved
	var vm_name = 'virtual_machine';
	var timeout = 20;
    
	var sandbox = new sandBoxMin(
		vm_name,
		wdir,
		folder,
		hw_num,
		hw_type,
		content,
		timeout
	);

	sandbox.run((data, time, err) => {
		res.send({output: data, errors: err, time: time});
	});
});

app.get('/', function(req, res) {
    res.sendfile("./index.html");
});

console.log("Listening at " + port)
app.listen(port);