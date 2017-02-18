vogels  = require('vogels');
joi     = require('joi');

module.exports = vogels.define('ChessMatch', {
    hashKey : 'matchHashID',

    schema : {
        matchHashID : joi.string().regex(/^[a-zA-Z0-9]{8}$/), /* 8 character hash */
        whitePlayerID : joi.string(),
        blackPlayerID : joi.string(),
        initialBoard : joi.string(),
        matchHistory : joi.array({
            index : joi.number().required(),
            command : joi.string().required(),
            board : joi.string().required()
        })
    }
});