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

var currentPlayer = 1;  // whose turn is it now?    1 = white, 0 = black

var board = [BLACK_ROOK, BLACK_KNIGHT, BLACK_BISHOP, BLACK_QUEEN, BLACK_KING, BLACK_BISHOP, BLACK_KNIGHT, BLACK_ROOK, 0, 0, 0, 0, 0, 0, 0, 0,
             BLACK_PAWN, BLACK_PAWN, BLACK_PAWN, BLACK_PAWN, BLACK_PAWN, BLACK_PAWN, BLACK_PAWN, BLACK_PAWN, 0, 0, 0, 0, 0, 0, 0, 0,
             0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
             0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
             0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
             0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
             WHITE_PAWN, WHITE_PAWN, WHITE_PAWN, WHITE_PAWN, WHITE_PAWN, WHITE_PAWN, WHITE_PAWN, WHITE_PAWN, 0, 0, 0, 0, 0, 0, 0, 0,
             WHITE_ROOK, WHITE_KNIGHT, WHITE_BISHOP, WHITE_QUEEN, WHITE_KING, WHITE_BISHOP, WHITE_KNIGHT, WHITE_ROOK, 0, 0, 0, 0, 0, 0, 0, 0];


function validateMove(currentPlayer, from, to){
    
    return true;

    if(currentPlayer * board[from] <= 0) {  // not your turn? 0 = Moving from an empty square
        return false;
    }
    
    if(currentPlayer * board[to[0]][to[1]] > 0) {  // cannot attack one of your own - empty move is also convered here
        return false;
    }
    
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