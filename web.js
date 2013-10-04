var express = require('express')
, path    = require('path');
var fs = require('fs');

var buf = new Buffer(50);

buf = fs.readFileSync('index.html');

var app = express.createServer(express.logger());
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', function(request, response) {
  response.send(buf.toString());
});

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});
