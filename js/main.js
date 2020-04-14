const { Chess } = require('../node_modules/chess.js')
let game;
let board;

const init = _ => {
	if(document.cookie=='')
		document.cookie='{}';
	let fen = JSON.parse(document.cookie).fen;
	var config = {
		draggable: true,
		position: fen!=undefined?fen:'start',
		onDragStart: onDragStart,
		onDrop: onDrop,
		pieceTheme: 'img/chesspieces/stefanrobert/{piece}.png',
		onSnapEnd: onSnapEnd
	}
	game = new Chess(fen);
	board = Chessboard('board', config);
}

const update = _ => {
	document.cookie = JSON.stringify({'fen': game.fen()})
	updateStatus();
}

const updateStatus = _ => {
	game.turn() === 'b'
		? moveColor = 'Schwarz'
		: moveColor = 'Weiß'
	// schachmatt?
	if( game.in_checkmate() ){
		Toastify({
			text: `Spielende: ${moveColor} ist im Schasch-Matt!`,
			duration: 5000,
			newWindow: true,
			gravity: 'bottom',
			position: 'center',
		}).showToast();
		document.cookie = '{}';
	}
	// gleichstand?
	else if( game.in_draw() ){
		Toastify({
			text: `Spielende, keiner gewinnt.`,
			duration: 5000,
			newWindow: true,
			gravity: 'bottom',
			position: 'center',
		}).showToast();
		document.cookie = '{}';
	}
		// schach?
	else if( game.in_check() )
		Toastify({
			text: `${moveColor} ist im Schasch und muss ziehen.`,
			duration: 3000,
			newWindow: true,
			gravity: 'bottom',
			position: 'center',
		}).showToast();
	// neuer Zug?
	else
		Toastify({
			text: `${moveColor} muss ziehen.`,
			duration: 3000,
			newWindow: true,
			gravity: 'bottom',
			position: 'center',
		}).showToast();
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
