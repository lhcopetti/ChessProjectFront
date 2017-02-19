var ChessMatch          = require('../js/models/ChessMatch');
var _                   = require('underscore');


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