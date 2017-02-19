var ChessMatch          = require('../js/models/ChessMatch');
var _                   = require('underscore');

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

		if (!chessMatch.matchHistory || chessMatch.matchHistory.length == 0) {
			turnForWhite = true;
			boardInput = chessMatch.initialBoard;
		}
		else {
			var lastIndex = _.max(chessMatch.matchHistory, function(arg) {
				return arg.index;
			});	
			turnForWhite = lastIndex.index % 2 == 0;
			boardInput = lastIndex.board;
		}

		userIDTurn = turnForWhite ? chessMatch.whitePlayerID : chessMatch.blackPlayerID;

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
				index : (lastIndex.index + 1),
				command : lambdaPayload.pgnCommand,
				board : lambdaPayload.fenBoardOutput
			};

			/* Append new history to the end of chess match */
			var params = {};
			params.UpdateExpression = 'SET #hist = list_append(#hist, :new_hist)';
			params.ExpressionAttributeNames = {'#hist' : 'matchHistory'};
			params.ExpressionAttributeValues = {':new_hist' : [chessHistory]};
			ChessMatch.update({matchHashID : matchID}, params, function(err, mov) {

			if (err) {
				console.log("Error while updateing chessHistory to database. " + err);
				return res.status(404).json({ success : false, message: err});
			}

			console.log("Output: " + JSON.stringify(chessHistory));
			return res.status(200).json(result);
			});

/*
			ChessMatch.update({
				matchHashID : matchID,
				matchHistory : { $add : [chessHistory]}
			}, function(err, result) {

				if (err) {
					console.log("Error while updateing chessHistory to database. " + err);
					return res.status(404).json({ success : false, message: err});
				}

				console.log("Output: " + JSON.stringify(chessHistory));
				return res.status(200).json(result);
				});

*/
		});
	});
}