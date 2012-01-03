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

var currentPlayer = 0x0;  // whose turn is it now?    0x0 = white, 0x8 = black

var board = [BLACK_ROOK, BLACK_KNIGHT, BLACK_BISHOP, BLACK_QUEEN, BLACK_KING, BLACK_BISHOP, BLACK_KNIGHT, BLACK_ROOK, 0, 0, 0, 0, 0, 0, 0, 0,
             BLACK_PAWN, BLACK_PAWN, BLACK_PAWN, BLACK_PAWN, BLACK_PAWN, BLACK_PAWN, BLACK_PAWN, BLACK_PAWN, 0, 0, 0, 0, 0, 0, 0, 0,
             0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
             0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
             0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
             0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
             WHITE_PAWN, WHITE_PAWN, WHITE_PAWN, WHITE_PAWN, WHITE_PAWN, WHITE_PAWN, WHITE_PAWN, WHITE_PAWN, 0, 0, 0, 0, 0, 0, 0, 0,
             WHITE_ROOK, WHITE_KNIGHT, WHITE_BISHOP, WHITE_QUEEN, WHITE_KING, WHITE_BISHOP, WHITE_KNIGHT, WHITE_ROOK, 0, 0, 0, 0, 0, 0, 0, 0];


function validateMove(currentPlayer, from, to){
    
    log(board[from], board[to], currentPlayer);
    
    // todo: move this check outside this function.    
    if(!board[from]){ // Moving from an empty square
        log('Moving from an empty square');
        return false;
    }
    
    // todo: move this check outside this function.
    if( (board[from] & 0x8) ^ currentPlayer ) {  // not your turn?
        log('not your turn?');
        return false;
    }
    
    if( (board[to] & 0x8) ^ currentPlayer ) {  // cannot attack one of your own
        log('cannot attack one of your own');
        return false;
    }
    
    return true;

    var dY = from[0] - to[0];
    var dX = from[1] - to[1];
    var dXY = dX * dY;
    var dYabs = Math.abs(dY);
    var dXabs = Math.abs(dY);
        
    // rook - any rook
    if(currentPlayer * board[from[0]][from[1]] === WHITE_ROOK){
        if( dXY !== 0 ){  // rook can only move in a file or a rank
            return false;
        }
    }
    
    // bishop - any bishop
    if(currentPlayer * board[from[0]][from[1]] === WHITE_BISHOP){
        if( dXabs !== dYabs ){  // bishop can only move diagonally
            return false;
        }
    }

    // king - any king
    if(currentPlayer * board[from[0]][from[1]] === WHITE_KING){
        //if(  ){
            return false;
        //}
    }
    
    return true;
}