var express 	= require('express');
var morgan 		= require('morgan');
var jwt			= require('jsonwebtoken');
var AWS			= require('aws-sdk');
var bodyParser  = require('body-parser');

var app 		= express();

var vogels 		= require('vogels');
var User 		= require('./public/js/models/User.js');

app.use('/', express.static('./public'));
app.set('views', './views');

app.set('superSecret', 'TheSecretOfAll');

app.use(bodyParser.urlencoded({extende : false}));
app.use(bodyParser.json());

app.use(morgan('dev'));


/* DynamoDB initialization */
AWS.config.update({
	region : "us-west-2",
	endpoint: "http://localhost:8000"
});

var dynamoDB = new AWS.DynamoDB();
vogels.dynamoDriver(dynamoDB);


vogels.createTables(function(err) {
	if (err)
	{
		console.log("Error creating tables: " + err);
		return;
	}

	console.log("Success! Tables have been created!");
});

var luis = new User({ loginID : "lhcopetti" , password : "12345678"});
var fez = new User({ loginID : "fez", password : "fez" });

luis.save(function(err) {});
fez.save(function(err) {});


var apiRoutes = express.Router();


apiRoutes.post('/authenticate', function(req, res) {

	var userLogin = req.body.name;
	var userPass = req.body.password;

	User.get(userLogin, function(err, usr) {

		if (err)
			throw err;

		if (!usr)
		{
			res.json({success : false, message: 'Authentication failed. User not found'});
			return;
		}

		console.log("userPass is: " + userPass + ". Password: " + usr.get('password') + ".");

		if (userPass !== usr.get('password'))
		{
			res.json({success : false, message: 'Authentication failed. Password does not match'});
			return;	
		}

		var token = jwt.sign({ loginID : usr.get('loginID') }, app.get('superSecret'), {
			expiresIn: "1d"
		});
		
		res.json({
			success : true,
			message : "Enjoy your token!",
			token : token
		});

	});

});

app.use('/api', apiRoutes);

app.listen(3000, function() {
	
	console.log("Server opened! Listening to PORT: 3000"); 
});