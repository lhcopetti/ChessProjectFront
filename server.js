var express 	= require('express');
var morgan 		= require('morgan');
var jwt			= require('jsonwebtoken');
var AWS			= require('aws-sdk');
var bodyParser  = require('body-parser');

var app 		= express();

var _ 			= require('underscore');

var vogels 		= require('vogels');
var User 		= require('./public/js/models/User.js');
var ChessMatch	= require('./public/js/models/ChessMatch.js');

var allChessMatches = require('./chessMatchesTest.js');

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
var braid = new User({ loginID: "braid", password : "BRAID" });

function saveChessCallback(err) {
	if (err)
	{
		console.log("Erro ao salvar partida de xadrez: " + err);
		return;
	}
}

_.forEach(allChessMatches, function(chessMatch) {
	chessMatch.save(saveChessCallback);
});


luis.save(function(err) {});
fez.save(function(err) {});
braid.save(function(err) {});


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

apiRoutes.use(function(req, res, next) {
	var token = req.body.token || req.query.token || req.headers['x-access-token'];

	if (!token) {
		return res.status(403).send({
			success : false,
			message : 'No token provided'
		});
	}

	jwt.verify(token, app.get('superSecret'), function(err, decoded) {
		if (err) {
			return res.json({
				success : false,
				message: 'Failed to authenticate token'
			});
		}

		req.decoded = decoded;
		next();
	});
});

apiRoutes.get('/users', function(req, res) {
	User.scan().loadAll().attributes(['loginID', 'createdAt']).exec(function(err, users) {
		if (err) {
			console.log("Erro: " + err);
		}

		return res.json(users.Items);
	});
});

apiRoutes.get('/users/:loginID', function(req, res) {
	var loginID = req.params.loginID;

	User.query(loginID).attributes(['loginID', 'createdAt']).exec(function(err, user){

		if (err)
		{
			console.log("Erro ao realizar query por login: " + loginID + ". " + err);
			return;
		}

		if (user.Count === 0)
			return res.status(404).send();
 
		return res.json(user.Items[0]);
	});
});

apiRoutes.get('/matches/ID/:matchID', function(req, res) {
	var matchID = req.params.matchID;

	ChessMatch.query(matchID).exec(function(err, match) {

		if (err) {
			console.log("Erro ao realizar a query: " + err);
			return;
		}

		if (match.Count === 0)
			return res.status(404).send();

		return res.json(match.Items[0]);
	});
});

apiRoutes.get('/matches/ID/:matchID/:index', function(req, res) {

	var matchID = req.params.matchID;
	var index = req.params.index;

	console.log("Index is: " + index);

	ChessMatch.query(matchID).exec(function(err, match) {

		if (err) {
			console.log("Erro ao realizar a query: " + err);
			return;
		}

		if (match.Count === 0)
			return res.status(404).send();


		var dbMatch = match.Items[0].attrs;
		console.log(dbMatch);

		var history = _.find(dbMatch.matchHistory, function(arg) {
			return arg.index == index;
		});

		console.log("History: " + JSON.stringify(history));
		if (!history)
			return res.status(404).send();

		return res.json(history);
	});

});

apiRoutes.get('/matches/user/:loginID', function(req, res) {

	var loginID = req.params.loginID;

	ChessMatch.scan().filterExpression('#w = :l OR #b = :l')
		.expressionAttributeValues({ ':l' : loginID})
		.expressionAttributeNames({ '#w' : 'whitePlayerID', '#b' : 'blackPlayerID'})
		.projectionExpression('whitePlayerID, blackPlayerID, matchHashID, gameOver')
		.exec(function(err, result) {
			if (err)
			{
				console.log("Erro ao filtrar partidas por usuário. " + err);
				return;
			}

			if (result.Count == 0)
				return res.status(404).send();

			res.json(result.Items);
		});
});


app.use('/api', apiRoutes);

app.listen(3000, function() {
	
	console.log("Server opened! Listening to PORT: 3000"); 
});