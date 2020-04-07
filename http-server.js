const http = require('http');

const express = require('express');
const app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", 'http://localhost:8000');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(express.json());

app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use('/chatroom', express.static(__dirname + '/chatroom'));

app.use(express.static(__dirname + '/WebInterface'));

const server = http.createServer(app);
const port = 8080;

server.listen(port);

console.debug('Server listening on port ' + port);
