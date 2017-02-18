vogels = require('vogels');
Joi = require('joi');

module.exports = vogels.define('User', {
    hashKey : 'loginID',

    schema : {
        loginID : Joi.string(),
        password : Joi.string()
    }
});