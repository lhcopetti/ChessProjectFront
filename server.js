var express = require('express');
var morgan = require('morgan');
var app = express();

app.use('/', express.static('./public'));
app.set('views', './views');

app.use(morgan('tiny'));

app.listen(3000, function() {
	
	console.log("Server opened! Listening to PORT: 3000"); 
});