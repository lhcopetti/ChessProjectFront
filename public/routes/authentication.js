var jwt 		= require('jsonwebtoken');
var User        = require('../js/models/User');

exports.authenticate = function(req, res) {

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

		var token = jwt.sign({ loginID : usr.get('loginID') }, 'superSecret', {
			expiresIn: "1d"
		});
		
		res.json({
			success : true,
			message : "Enjoy your token!",
			token : token
		});
    })
};

exports.validate = function(req, res, next) {
	var token = req.body.token || req.query.token || req.headers['x-access-token'];

	if (!token) {
		return res.status(403).send({
			success : false,
			message : 'No token provided'
		});
	}

	jwt.verify(token, 'superSecret', function(err, decoded) {
		if (err) {
			return res.json({
				success : false,
				message: 'Failed to authenticate token'
			});
		}

		req.decoded = decoded;
		next();
	});
};