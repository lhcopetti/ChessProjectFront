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

exports.registerUser = function(req, res) 
{
	var loginID = req.body.loginID;
	var password = req.body.password;

	if (!loginID || !password) {
		return res.status(404).json({ success: false, message: 'The request is missing parameters: [loginID, password]'});
	}

	User.query(loginID).exec(function(err, user) {

		if (err) {
			console.log('Error while trying to query for pre-existing user: ' + loginID);
		}

		if (user.Count > 0) {
			return res.status(404).json({ success: false, message: 'User [' + loginID + '] already exists'});
		}

		var newUser = new User({
			'loginID' : loginID,
			'password' : password
		});
		newUser.save(function(err) {
			if (err) {
				console.log("Error while persisting new user: " + JSON.stringify(newUser));
				return res.status(404).json({ success: false, 'message': err});
			}

			res.json({success: true, message: 'User created successfully'});

		});
	});
}