var express 	= require('express');
var morgan 		= require('morgan');
var jwt			= require('jsonwebtoken');
var AWS			= require('aws-sdk');
var bodyParser  = require('body-parser');

var app 		= express();
var _			= require('underscore');

var vogels 		= require('vogels');
var User 		= require('./public/js/models/User.js');
var ChessMatch	= require('./public/js/models/ChessMatch.js');

var allChessMatches = require('./chessMatchesTest.js');

var routeAuthentication 	= require('./public/routes/authentication');
var routeUser 				= require('./public/routes/user');
var routeMatches 			= require('./public/routes/matches');

app.use('/', express.static('./public'));
app.set('views', './views');

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

apiRoutes.post('/authenticate', routeAuthentication.authenticate);
/* JWT middleware validation */
apiRoutes.use(routeAuthentication.validate);

/* v  Protected API  v */
apiRoutes.get('/users', 			routeUser.getAll);
apiRoutes.get('/users/:loginID', 	routeUser.getSingle);
apiRoutes.post('/users',			routeUser.registerUser);

apiRoutes.get ('/matches/ID/:matchID', 				routeMatches.matchByID);
apiRoutes.post('/matches/ID/:matchID',				routeMatches.play);
apiRoutes.get ('/matches/ID/:matchID/index/:index',	routeMatches.byIDandIndex);
apiRoutes.get ('/matches/user/:loginID', 			routeMatches.matchesByLogin);

app.use('/api', apiRoutes);

app.listen(3000, function() {
	
	console.log("Server opened! Listening to PORT: 3000"); 
});