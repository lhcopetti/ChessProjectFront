vogels  = require('vogels');
joi     = require('joi');

module.exports = vogels.define('ChessMatch', {
    hashKey : 'matchHashID',

    schema : {
        matchHashID : joi.string().regex(/^[a-zA-Z0-9]{8}$/), /* 8 character hash */
        whitePlayerID : joi.string(),
        blackPlayerID : joi.string(),
        initialBoard : joi.string(),
        matchHistory : {
            pgnCommands : vogels.types.stringSet(),
            FENBoard : vogels.types.stringSet()
        }
    }
});