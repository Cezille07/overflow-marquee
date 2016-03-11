'use strict';

var express = require('express');
var app = express();

var port = process.env.PORT || 8080;

app.use('/node_modules', express.static('node_modules'));
app.use('/src', express.static('src'));
app.use(express.static('demo'));

var server = app.listen(port, function() {
	console.log("Listening at " + server.address().port);
});