var moveCount = 0;

var WHITE = 0x0;
var BLACK = 0x8;

var WHITE_PAWN = 0x01;
var WHITE_KNIGHT = 0x02;
var WHITE_KING = 0x03;
var WHITE_BISHOP = 0x05;
var WHITE_ROOK = 0x06;
var WHITE_QUEEN = 0x07;

var BLACK_PAWN = 0x09;
var BLACK_KNIGHT = 0x0A;
var BLACK_KING = 0x0B;
var BLACK_BISHOP = 0x0D;
var BLACK_ROOK = 0x0E;
var BLACK_QUEEN = 0x0F;

var currentPlayer = WHITE;  // whose turn is it now?

var board = [BLACK_ROOK, BLACK_KNIGHT, BLACK_BISHOP, BLACK_QUEEN, BLACK_KING, BLACK_BISHOP, BLACK_KNIGHT, BLACK_ROOK, 0, 0, 0, 0, 0, 0, 0, 0,
             BLACK_PAWN, BLACK_PAWN, BLACK_PAWN, BLACK_PAWN, BLACK_PAWN, BLACK_PAWN, BLACK_PAWN, BLACK_PAWN, 0, 0, 0, 0, 0, 0, 0, 0,
             0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
             0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
             0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
             0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
             WHITE_PAWN, WHITE_PAWN, WHITE_PAWN, WHITE_PAWN, WHITE_PAWN, WHITE_PAWN, WHITE_PAWN, WHITE_PAWN, 0, 0, 0, 0, 0, 0, 0, 0,
             WHITE_ROOK, WHITE_KNIGHT, WHITE_BISHOP, WHITE_QUEEN, WHITE_KING, WHITE_BISHOP, WHITE_KNIGHT, WHITE_ROOK, 0, 0, 0, 0, 0, 0, 0, 0];


function validateMove(from, to, currentPlayer){
    return isPseudoLegal(from, to, currentPlayer) && checkAfterMove(from, to, currentPlayer);
}

function isPseudoLegal(from, to, currentPlayer){
    
    var fromPiece = board[from];
    var toPiece = board[to];
    
    //log(from + ' => ' + to, fromPiece, toPiece, currentPlayer);
    
    if(!fromPiece){ // Moving an empty square?
        return false;
    }
    
    if( (fromPiece & 0x8) ^ currentPlayer ) {  // not your turn?
        return false;
    }
    
    if(toPiece && (toPiece & 0x8) === currentPlayer ) {  // cannot attack one of your own
        return false;
    }

    if((fromPiece & 0x07) === 0x07){ // queen
        if( (Math.abs(from - to) % 15 && Math.abs(from - to) % 17) &&    // bishop move
            ((from & 0x0F) !== (to & 0x0F) && (from & 0xF0) !== (to & 0xF0))){  // rook move
            return false;
        }
    }else if((fromPiece & 0x06) === 0x06){ // rook
        if( (from & 0x0F) !== (to & 0x0F) && (from & 0xF0) !== (to & 0xF0)  ){  // move in a file or a rank
            return false;
        }
    }else if((fromPiece & 0x05) === 0x05){ // bishop
        if( Math.abs(from - to) % 15 && Math.abs(from - to) % 17 ){  // bishop can only move diagonally
            return false;
        }
    }else if((fromPiece & 0x03) === 0x03){ // king
        var diff = Math.abs(from - to);
        if( diff !== 1  && diff !== 16 && diff !== 17 && diff !== 15 ){
            return false;
        }
    }else if((fromPiece & 0x02) === 0x02){ // knight
        var diff = Math.abs(from - to);
        if( diff !== 14  && diff !== 18 && diff !== 31 && diff !== 33 ){
            return false;
        }
    }else if((fromPiece & 0x01) === 0x01){ // pawn
        var direction = from - to > 0 ? 0x0 : 0x8;  
        var diff = Math.abs(from - to);
        var fromRow = from & 0x70;
        
        if( direction !== currentPlayer ){ // a pawn can only move forward
            return false;
        }
        
        if(diff === 16 && !toPiece){  // single move forward?
            // valid
        } else if(diff === 32 && !toPiece && (fromRow === 0x60 || fromRow === 0x10)){  // double move from start
            // valid
        } else if ((diff === 15 || diff === 17) && toPiece) {
            // valid
        } else {
            return false;
        }
        
        // todo - En passant
        // todo - castling
        
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

function makeMove(from, to){
    var capturedPiece = board[to];
    board[to] = board[from];
    board[from] = 0;
    currentPlayer = currentPlayer ? 0 : 8;
    moveCount++;
    return capturedPiece;
}

function unMakeMove(from, to, capturedPiece){
    board[from] = board[to];    
    board[to] = capturedPiece;
    currentPlayer = (currentPlayer === 0) ? 8 : 0;
    moveCount--;
    return true;
}

function checkAfterMove(from, to, currentPlayer){
    var capturedPiece = makeMove(from, to);
    
    /* Find my king */
    for( var i = 0 ; i < 128 ; i++ ){
        if(board[i] === (currentPlayer ? BLACK_KING : WHITE_KING) ){
            var kingPosition = i;
        }
    }
    
    for( var i = 0 ; i < 128 ; i++ ){
        if(board[i]){
            if(isPseudoLegal(i, kingPosition, currentPlayer ? 0 : 8)){
                unMakeMove(from, to, capturedPiece);
                return false;
            }
        }
    }
    
    unMakeMove(from, to, capturedPiece);
    return true;
}