function ChessBoard(boardInFEN) {
    this.fenBoard = boardInFEN;

    this.init();
}

ChessBoard.prototype.getPieces = function() {

    var arr = [];
    var rows = 8;

    for (var i = 0; i < rows; i++)
        arr[i] = [];


    var x = 0;
    var y = 7;

    for (var i = 0; i < this.stringBoard.length; i++)
    {
        if (this.stringBoard[i] === "/")
        {
            y--;
            x = 0;
            continue;
        }
        
        if ($.isNumeric(this.stringBoard[i]))
        {
            x += parseInt(this.stringBoard[i]);
            continue;
        }
        
        arr[x][y] = this.stringBoard.charAt(i);
        x++;
    }

    return arr;
}


ChessBoard.prototype.init = function() {

    var splittedBoard = this.fenBoard.split(" ");
    this.stringBoard = splittedBoard[0];

    this.chessPieces = this.getPieces(splittedBoard[0]); 
    this.colorToPlay = splittedBoard[1];
    this.enPassant = splittedBoard[2];
    this.castleInfo = splittedBoard[3];
    this.halfMove = splittedBoard[4];
    this.fullMove = splittedBoard[5];
}

ChessBoard.prototype.printInfo = function() {
    return "The board is: " + this.chessPieces[6][7];
}