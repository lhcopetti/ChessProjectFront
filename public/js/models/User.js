vogels  = require('vogels');
joi     = require('joi');

module.exports = vogels.define('User', {
    hashKey : 'loginID',

    timestamps : true,
    updatedAt : false,

    schema : {
        loginID : joi.string(),
        password : joi.string()
    }
});