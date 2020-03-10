var http = require('http');
var fs = require('fs');

var express = require('express');
var app = express();

var cors = require('cors');

app.use(cors());

app.use(express.json());

app.use(express.static(__dirname + '/WebInterface'));

var server = http.createServer(app);
var port = 8080;

server.listen(port);