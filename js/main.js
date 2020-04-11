const { Chess } = require('../node_modules/chess.js')
const game = new Chess();

let board;

const init = _ => {
	var config = {
		draggable: true,
		position: 'start',
		onDragStart: onDragStart,
		onDrop: onDrop,
		pieceTheme: 'img/chesspieces/stefanrobert/{piece}.png',
		onSnapEnd: onSnapEnd
	}
	board = Chessboard('board', config);
}

const update = _ => {
	console.log(updateStatus());
}

const updateStatus = _ => {
	game.turn() === 'b'
		? moveColor = 'Schwarz'
		: moveColor = 'Weiß'
	// schachmatt?
	if( game.in_checkmate() )
		return `Spielende: ${moveColor} ist im Schasch Matt!`;
	// gleichstand?
	else if( game.in_draw() )
		return `Game over, keiner gewinnt.`;
	// schach?
	else if( game.in_check() )
		return `${moveColor} ist im Schasch und muss ziehen.`;
	// neuer Zug?
	else
		return `${moveColor} muss ziehen.`;

};
const onDragStart = (source, piece, position, orientation) => {
	// if gameover : no pieces move
	if( game.game_over() )
		return false;
	// if picked piece is not at turn : no piece moves
	if( 	game.turn() == 'w' && piece.search(/^b/) != -1
		||	game.turn() == 'b' && piece.search(/^w/) != -1)
		return false
};
const onDrop = (source, target) => {
	// check if move is legal
	var move = game.move({
		from      : source,
		to        : target,
		promotion : 'q', // always promote to a queen
	});
	// illegal move
	if( move === null )
		return 'snapback';
	update();
};
const onSnapEnd = _ => {
	board.position(game.fen());
};

// START
init();
update();
