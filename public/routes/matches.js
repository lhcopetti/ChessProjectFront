var ChessMatch          = require('../js/models/ChessMatch');
var User				= require('../js/models/User');

var _                   = require('underscore');
var async				= require('async');

var lambda				= require('../js/lambda/interpretCommand');


exports.matchByID = function(req, res) {
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
};

exports.byIDandIndex = function(req, res) {

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

};

exports.matchesByLogin = function(req, res) {

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
};

exports.play = function(req, res) {

	var userID  = req.decoded.loginID;
	var matchID = req.params.matchID;
	var command = req.body.pgnCommand;

	console.log("Play route. User: " + userID + " GameID: " + matchID + " Command: " + command);

	if (!command) {
		return res.status(404).json({ success: false, message: 'There is no command available'});
	}

	ChessMatch.query(matchID).exec(function(err, data) {
		if (err) {
			console.log("Erro ao recuperar partida: " + matchID + ". " + err);
			return;
		}

		if (data.Count == 0) {
			return res.status(404).json({ success : false, message: 'There is no game with the given ID: ' + matchID});
		}

		var chessMatch = data.Items[0].attrs;

		if (chessMatch.gameOver) {
			return res.status(404).json({ success: false, message: 'The game ['+ matchID +'] is already over!'});
		}

		var turnForWhite = false;
		var boardInput = "";
		var lastIndex;

		if (!chessMatch.matchHistory || chessMatch.matchHistory.length == 0) {
			turnForWhite = true;
			boardInput = chessMatch.initialBoard;
			lastIndex = 0;
		}
		else {
			var lastHistory = _.max(chessMatch.matchHistory, function(arg) {
				return arg.index;
			});	
			turnForWhite = lastHistory.index % 2 == 0;
			boardInput = lastHistory.board || chessMatch.initialBoard;
			lastIndex = lastHistory.index;
		}

		userIDTurn = turnForWhite ? chessMatch.whitePlayerID : chessMatch.blackPlayerID;
		console.log("User turn is: " + userIDTurn);

		if (userIDTurn != userID) {
			return res.status(404).json({ success: false, message: 'It is not your turn to play.'});
		}

		lambda.sendCommand(boardInput, command, function(err, result) {
			if (err) {
				return res.status(404).json({ success: false, message: 'Error calling lambda: ' + err});
			}

			if (result.StatusCode != 200) {
				return res.status(result.StatusCode).json({
					success : false,
					message : 'Lambda status error'
				});
			}

			var lambdaPayload = JSON.parse(result.Payload);

			if (lambdaPayload.errorCode != 0) {
				return res.status(404).json({ success: false, message: 'Chess logic error: ' + lambdaPayload.errorMessage});
			}

			var chessHistory = {
				'index' : (lastIndex + 1),
				'command' : lambdaPayload.pgnCommand,
				'board' : lambdaPayload.fenBoardOutput
			};

			/* Append new history to the end of chess match */
			var params = {};
			params.UpdateExpression = 'SET #hist = list_append(#hist, :new_hist)';
			params.ExpressionAttributeNames = {'#hist' : 'matchHistory'};
			params.ExpressionAttributeValues = {':new_hist' : [chessHistory]};
			ChessMatch.update({matchHashID : matchID}, params, function(err, mov) {

			if (err) {
				console.log("Error while updating chessHistory to database. " + err);
				return res.status(404).json({ success : false, message: err});
			}

			console.log("Output: " + JSON.stringify(chessHistory));
			return res.status(200).json(result);
			});
		});
	});
}

function makeMatchHashID(length)
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < length; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function generateUniqueHashID() {

	var maxRetries = 10;
	var counter = 0;

	while(counter++ < maxRetries) {

	}

}

function checkWhitePlayerExistence(createMatchArgs, callback) {

		User.query(createMatchArgs.wPlayer).exec(function(err, user) {

		if (err) 
			callback("White player query error: " + err);
		else 
			callback(null, createMatchArgs);
	});
}


function checkBlackPlayerExistence(createMatchArgs, callback) {

		User.query(createMatchArgs.bPlayer).exec(function(err, user) {

		if (err) 
			callback("Black player query error: " + err);
		else
			callback(null, createMatchArgs);
	});
}

function checkUniqueHashID(createMatchArgs, callback) {

		ChessMatch.query(createMatchArgs.ID).exec(function(err, result) {

			if (err)
			{
				callback(err);
			}
			else if (result.Count > 0)
			{
				callback('MatchHashID just created [' + createMatchArgs.ID + '] already exists in the database');
			}
			else		
				callback(null, createMatchArgs);
	});
}

function saveNewMatch(createMatchArgs, callback) 
{
	var newMatch = new ChessMatch({
			'matchHashID': createMatchArgs.ID,
			'whitePlayerID' : createMatchArgs.wPlayer,
			'blackPlayerID' : createMatchArgs.bPlayer,
			'initialBoard' : createMatchArgs.iBoard,
			'matchHistory' : createMatchArgs.matchHistory
		});

	console.log(newMatch);
	newMatch.save(callback);
}

exports.createMatch = function(req, res) 
{ 

	var whitePlayerID = req.body.whitePlayerID;
	var blackPlayerID = req.body.blackPlayerID;
	var initialBoard = req.body.initialBoard || 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

	if (!whitePlayerID || !blackPlayerID)
		return res.status(404).json({success: false, 'message': 'Request is missing parameters [whitePlayerID, blackPlayerID, initialBoard (optional)]'});

	/* Generate an unused hashID */
	var matchID = makeMatchHashID(8);

	var createMatchArgs = { 
		'ID' : matchID, 
		'wPlayer' : whitePlayerID, 
		'bPlayer' : blackPlayerID, 
		'iBoard' : initialBoard,
		'matchHistory' : [{'index': 0}]};

	async.waterfall(
		[
			async.constant(createMatchArgs),
			checkUniqueHashID,
			checkWhitePlayerExistence,
			checkBlackPlayerExistence,
			saveNewMatch
		], 
	function(err) {
		if (err) {
			console.log('Error while creating new match [' + err + '] for ' + JSON.stringify(createMatchArgs));
			return res.status(404).json({success: false, 'message' : err});
		}

		return res.json({success: true, message: 'Match created successfully'});		
	});
}