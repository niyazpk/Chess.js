var moveCount = 0;  // Counter for number of moves


/* Following are a few var names defined for better code readability. */

var WHITE = 0x0;
var BLACK = 0x8;

var PAWN = 0x01;
var KNIGHT = 0x02;
var KING = 0x03;
var BISHOP = 0x05;
var ROOK = 0x06;
var QUEEN = 0x07;


// White pieces have their 4th bit = 0
var WHITE_PAWN = 0x01;
var WHITE_KNIGHT = 0x02;
var WHITE_KING = 0x03;
var WHITE_BISHOP = 0x05;
var WHITE_ROOK = 0x06;
var WHITE_QUEEN = 0x07;

// Black pieces have their 4th bit = 1
var BLACK_PAWN = 0x09;
var BLACK_KNIGHT = 0x0A;
var BLACK_KING = 0x0B;
var BLACK_BISHOP = 0x0D;
var BLACK_ROOK = 0x0E;
var BLACK_QUEEN = 0x0F;

var currentPlayer = WHITE;  // whose turn is it now?

// Initial state
var board = [BLACK_ROOK, BLACK_KNIGHT, BLACK_BISHOP, BLACK_QUEEN, BLACK_KING, BLACK_BISHOP, BLACK_KNIGHT, BLACK_ROOK, 0, 0, 0, 0, 0, 0, 0, 0,
             BLACK_PAWN, BLACK_PAWN, BLACK_PAWN, BLACK_PAWN, BLACK_PAWN, BLACK_PAWN, BLACK_PAWN, BLACK_PAWN, 0, 0, 0, 0, 0, 0, 0, 0,
             0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
             0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
             0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
             0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
             WHITE_PAWN, WHITE_PAWN, WHITE_PAWN, WHITE_PAWN, WHITE_PAWN, WHITE_PAWN, WHITE_PAWN, WHITE_PAWN, 0, 0, 0, 0, 0, 0, 0, 0,
             WHITE_ROOK, WHITE_KNIGHT, WHITE_BISHOP, WHITE_QUEEN, WHITE_KING, WHITE_BISHOP, WHITE_KNIGHT, WHITE_ROOK, 0, 0, 0, 0, 0, 0, 0, 0];

var castleRights = 0xF; // 4 bits to track castling on each side for both players

function validateMove(from, to, currentPlayer){
    return isPseudoLegal(from, to, currentPlayer) && !checkAfterMove(from, to, currentPlayer);
}

function isPseudoLegal(from, to, currentPlayer){

    var fromPiece = board[from];
    var toPiece = board[to];

    //log(from + ' => ' + to, fromPiece, toPiece, currentPlayer);

    if(!fromPiece){ // Moving an empty square?
        return false;
    }

    if (to & 0x88){ // moving to outside valid board?
        return false;
    }

    if( (fromPiece & 0x8) ^ currentPlayer ) {  // not your turn?
        return false;
    }

    if(toPiece && (toPiece & 0x8) === currentPlayer ) {  // cannot attack one of your own
        return false;
    }

    var pieceType = fromPiece & 0x07;

    if(pieceType === QUEEN){ // queen
        if( (Math.abs(from - to) % 15 && Math.abs(from - to) % 17) &&    // bishop move
            ((from & 0x0F) !== (to & 0x0F) && (from & 0xF0) !== (to & 0xF0))){  // rook move
            return false;
        }
    }else if(pieceType === ROOK){ // rook
        if( (from & 0x0F) !== (to & 0x0F) && (from & 0xF0) !== (to & 0xF0)  ){  // move in a file or a rank
            return false;
        }
    }else if(pieceType === BISHOP){ // bishop
        if( Math.abs(from - to) % 15 && Math.abs(from - to) % 17 ){  // bishop can only move diagonally
            return false;
        }
    }else if(pieceType === KING){ // king
        var diff = Math.abs(from - to);
        var direction = from - to > 0 ? 0x0 : 0x1;

        if( diff === 1  || diff === 16 || diff === 17 || diff === 15 ){
            // valid
        } else if ( diff === 2 && // castling
                   (castleRights >> (currentPlayer/4 + direction)) & 1 && // casling is available in this direction
                   ! isSquareUnderAttack(from, currentPlayer) && // king is not in check now
                   ! checkAfterMove(from, from + (direction ? 1 : -1), currentPlayer) && // the next square is not in check
                   isPseudoLegal(from + (direction ? 3 : -4), from + (direction ? 1 : -1), currentPlayer) ){ // rook can move
            // valid
        } else {
            return false;
        }
    } else if(pieceType === KNIGHT){ // knight
        var diff = Math.abs(from - to);
        if( diff !== 14  && diff !== 18 && diff !== 31 && diff !== 33 ){
            return false;
        }
    } else if(pieceType === PAWN){ // pawn
        var direction = from - to > 0 ? 0x0 : 0x8;
        var diff = Math.abs(from - to);
        var fromRow = from & 0x70;

        if( direction !== currentPlayer ){ // a pawn can only move forward
            return false;
        }

        if(diff === 16 && !toPiece){  // single move forward?
            // valid
        } else if(diff === 32 &&
                  (fromRow === 0x60 || fromRow === 0x10) &&
                  !toPiece &&
                  !board[from + (direction ? 16 : -16)]){  // double move from start
            // valid
        } else if ((diff === 15 || diff === 17) && toPiece) {
            // valid
        } else {
            return false;
        }

        // todo - En passant
    }

    if(fromPiece & 0x04){ // sliding piece
        var diff = to - from;
        var step;

        if(diff % 17 === 0){
            step = 17;
        }else if(diff % 15 === 0){
            step = 15;
        }else if(diff % 16 === 0){
            step = 16;
        }else{
            step = 1;
        }

        var iterations = diff/step;
        if(iterations < 0){
            step = -step;
            iterations = -iterations;
        }

        var path = from + step;
        for(var i = 1; i < iterations; i++, path+=step){
            if(board[path]){
                return false;
            }
        }
    }

    return true;
}


/*
    Makes a move on the board.
    This function is called only if the move is a valid move.
    This method takes care of moving the pieces on the board and
    setting any other variables like castlerights.
*/

function makeMove(from, to){

    var capturedPiece = board[to];
    board[to] = board[from];
    board[from] = 0;

    // Hack to remember castleRights so that we don't
    // have to use a stack to keep track of it.
    var stateData = (capturedPiece << 4) + castleRights;


    if( (board[to] & 0x07) === KING ){

        // King-moves reset both castling bits per side.
        castleRights &= ~(3 << (currentPlayer/4));

        // move rook too if it is a castling move
        if( Math.abs(from - to) === 2 ){
            var rookTo = from + (from > to ? -1 : 1);
            var rookFrom = from + (from > to ? -4 : 3);

            board[rookTo] = board[rookFrom];
            board[rookFrom] = 0;
        }
    }

    // Rook-move resets castling in that side
    if( (board[to] & 0x07) === ROOK ){
        if(from === 0x0 || from === 0x70){
            var direction = 0;
            castleRights &= ~(1 << (currentPlayer/4 + direction));
        } else if (from === 0x7 || from === 0x77) {
            var direction = 1;
            castleRights &= ~(1 << (currentPlayer/4 + direction));
        }
    }

    // Capture of rook resets castling in that side
    if( (capturedPiece & 0x07) === ROOK ){
        if(to === 0x0 || to === 0x70){
            var direction = 0;
            var otherPlayer = currentPlayer ? 0 : 8;
            castleRights &= ~(1 << (otherPlayer/4 + direction));
        } else if (to === 0x7 || to === 0x77) {
            var direction = 1;
            var otherPlayer = currentPlayer ? 0 : 8;
            castleRights &= ~(1 << (otherPlayer/4 + direction));
        }
    }

    currentPlayer = currentPlayer ? 0 : 8;
    moveCount++;
    log(castleRights.toString(2));
    return stateData;
}

/*
    Reverts ALL changes made by makeMove
*/

function unMakeMove(from, to, stateData){
    board[from] = board[to];
    board[to] = stateData >> 4;
    castleRights = stateData & 0xF;

    // undo castling
    if( (board[from] & 0x07) === KING &&
        Math.abs(from - to) === 2){
        var rookTo = from + (from > to ? -1 : 1);
        var rookFrom = from + (from > to ? -4 : 3);

        board[rookFrom] = board[rookTo];
        board[rookTo] = 0;
    }

    currentPlayer = (currentPlayer === 0) ? 8 : 0;
    moveCount--;
    return true;
}

function checkAfterMove(from, to, currentPlayer){
    var stateData = makeMove(from, to);

    /* Find my king */
    for( var i = 0 ; i < 128 ; i++ ){
        if(board[i] === (currentPlayer ? BLACK_KING : WHITE_KING) ){
            var kingPosition = i;
            break;
        }
    }

    var isKingUnderAttack = isSquareUnderAttack(kingPosition, currentPlayer);
    unMakeMove(from, to, stateData);
    return isKingUnderAttack;
}

/*
    Important Note: This fn cannot be used to check attacks on empty squares
    as of now since pawn captures to empty squares will not validate (todo: fix this)
*/
function isSquareUnderAttack(square, currentPlayer){
    for( var i = 0 ; i < 128 ; i++ ){
        if(board[i]){
            if(isPseudoLegal(i, square, currentPlayer ? 0 : 8)){
                return true;
            }
        }
    }
    return false;
}