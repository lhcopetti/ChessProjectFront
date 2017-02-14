window.addEventListener('load', body_onload);

var BOARD_SIZE = 400;
var frameCounter = 0;

var BACKGROUND_WHITE = 0xffffe6;
var BACKGROUND_BLACK = 0x808080;

function body_onload() {
    var principalState = {

        getCellSize: function() {
            return BOARD_SIZE / 8;
        },

        drawBackCells: function() {

            var isBlack = false;
            var graphics = game.add.graphics(0, 0);

            for (var x = 0; x < 8; x++)
            {
                for (var y = 0; y < 8; y++)
                {
                    cellSize = this.getCellSize();

                    graphics.beginFill(isBlack ? BACKGROUND_BLACK : BACKGROUND_WHITE);
                    graphics.drawRect(x * cellSize, y * cellSize, cellSize, cellSize);
                    graphics.endFill();

                    isBlack ^= true;
                }
                isBlack ^= true;
            }
        },
        drawAtPosition(x, y, pgnChessPiece) {


            var indexAtSprite = this.chessIndex.indexOf(pgnChessPiece.toLowerCase());
            if (this.isLowerCase(pgnChessPiece))
                indexAtSprite += this.chessIndex.length;

            const scalePGN = 50 / 333;

            var chessPiece = game.add.sprite(x * this.getCellSize(), y * this.getCellSize(), 'chess-set');
            chessPiece.scale.setTo(scalePGN, scalePGN);
            chessPiece.frame = indexAtSprite;
            this.chessPieces.add(chessPiece);
        },
        drawBoard(FENBoard, blacksView)
        {
            if (typeof blacksView === 'undefined') { blacksView = false; }

            var board = new ChessBoard(FENBoard);

            var fenPieces = board.getPieces();

            for (var i = 0; i < 8; i++)
                for (var j = 0; j < 8; j++)
                    if (fenPieces[i][j])
                        this.drawAtPosition(i, blacksView ? 7 - j : j, fenPieces[i][j]);

        },
        drawGrid: function()  {

            for (var i = 0; i < 8; i++)
            {
                line = new Phaser.Line(0, cellSize * i, game.width, cellSize * i);
                game.debug.geom(line);
            }

            for (var i = 0; i < 8; i++)
            {
                line = new Phaser.Line(cellSize * i, 0, cellSize * i, game.height);
                game.debug.geom(line);
            }

        },

        preload: function () {

            game.load.spritesheet('chess-set', '../assets/imgs/chess_piece_set.png', 333, 333, 12);

        },
        create: function () {

            this.chessPieces = game.add.group();

            this.chessIndex = ["k", "q", "b", "n", "r", "p"];
            this.isLowerCase = (string) => /^[a-z]$/.test(string)

            this.game.stage.backgroundColor = "#ffdd99";
            this.drawBackCells();
            this.drawGrid();
            game.world.bringToTop(this.chessPieces);

            var command = $('#fen-board').text();

            this.drawBoard(command, true);
        },
        update: function () {

/*            var command = $('#pgn-command').val();

            if (command)
                alert("The command is: " + command);
*/
        }
    };
    var game = new Phaser.Game(BOARD_SIZE, BOARD_SIZE, Phaser.AUTO, 'gameDiv');
    game.state.add('principal', principalState);
    game.state.start('principal');
};