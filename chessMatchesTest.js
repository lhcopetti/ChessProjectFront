var ChessMatch	= require('./public/js/models/ChessMatch.js');

module.exports = [new ChessMatch({
	
	matchHashID: "H4dF9c3o",
	whitePlayerID : "lhcopetti",
	blackPlayerID : "fez",
	initialBoard : "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
	matchHistory : 
	[{
			index: 1,
			command : "e4",
			board : "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1"
		},
		{
			index: 2,
			command : "e5",
			board : "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2"
		},
		{
			index: 3,
			command : "Nf3",
			board : "rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2"
		},
		{
			index: 4,
			command : "Nf6",
			board : "rnbqkb1r/pppp1ppp/5n2/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3"
		}]
}),
new ChessMatch({
	
	matchHashID: "I4dF9c3o",
	whitePlayerID : "fez",
	blackPlayerID : "lhcopetti",
	initialBoard : "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
	matchHistory : 
	[{
			index: 1,
			command : "e4",
			board : "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1"
		},
		{
			index: 2,
			command : "e5",
			board : "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2"
		},
		{
			index: 3,
			command : "Nf3",
			board : "rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2"
		},
		{
			index: 4,
			command : "Nf6",
			board : "rnbqkb1r/pppp1ppp/5n2/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3"
		}]
}),
new ChessMatch({
	
	matchHashID: "J4dF9c3o",
	whitePlayerID : "fez",
	blackPlayerID : "lhcopetti",
	initialBoard : "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    gameOver     : true,
	matchHistory : 
	[{
			index: 1,
			command : "e4",
			board : "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1"
		},
		{
			index: 2,
			command : "e5",
			board : "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2"
		},
		{
			index: 3,
			command : "Nf3",
			board : "rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2"
		},
		{
			index: 4,
			command : "Nf6",
			board : "rnbqkb1r/pppp1ppp/5n2/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3"
		}]
}),
new ChessMatch({
	
	matchHashID: "K4dF9c3o",
	whitePlayerID : "fez",
	blackPlayerID : "lhcopetti",
	initialBoard : "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
}),
new ChessMatch({
	
	matchHashID: "L4dF9c3o",
	whitePlayerID : "fez",
	blackPlayerID : "lhcopetti",
	initialBoard : "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
	matchHistory : 
	[{
			index: 1,
			command : "e4",
			board : "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1"
	}]
})
];