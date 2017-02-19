var express         = require('express');

var User            = require('../js/models/User');

exports.getAll = function(req, res) 
{
	User.scan().loadAll().attributes(['loginID', 'createdAt']).exec(function(err, users) {
		if (err) {
			console.log("Erro: " + err);
		}

		return res.json(users.Items);
	});
};

exports.getSingle =  function(req, res) 
{
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
};