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


function validateMove(from, to, currentPlayer){
    
    fromPiece = board[from];
    toPiece = board[to];
    
    log(from + ' => ' + to, fromPiece, toPiece, currentPlayer);
    
    if(!fromPiece){ // Moving an empty square?
        log('Moving an empty square?');
        return false;
    }
    
    if( (fromPiece & 0x8) ^ currentPlayer ) {  // not your turn?
        log('Not your turn');
        return false;
    }
    
    if(toPiece && (toPiece & 0x8) === currentPlayer ) {  // cannot attack one of your own
        log('Cannot attack one of your own.');
        return false;
    }

    if((fromPiece & 0x07) === 0x07){ // queen
        if( (Math.abs(from - to) % 15 && Math.abs(from - to) % 17) &&    // bishop move
            ((from & 0x0F) !== (to & 0x0F) && (from & 0xF0) !== (to & 0xF0))){  // rook move
            log('not a valid queen move');
            return false;
        }
    }else if((fromPiece & 0x06) === 0x06){ // rook
        if( (from & 0x0F) !== (to & 0x0F) && (from & 0xF0) !== (to & 0xF0)  ){  // move in a file or a rank
            log('not a valid rook move');
            return false;
        }
    }else if((fromPiece & 0x05) === 0x05){ // bishop
        if( Math.abs(from - to) % 15 && Math.abs(from - to) % 17 ){  // bishop can only move diagonally
            log('not a valid bishop move');
            return false;
        }
    }else if((fromPiece & 0x03) === 0x03){ // king
        var diff = Math.abs(from - to);
        if( diff !== 1  && diff !== 16 && diff !== 17 && diff !== 15 ){
            log('not a valid king move');
            return false;
        }
    }else if((fromPiece & 0x02) === 0x02){ // knight
        var diff = Math.abs(from - to);
        if( diff !== 14  && diff !== 18 && diff !== 31 && diff !== 33 ){
            log('not a valid knight move');
            return false;
        }
    }else if((fromPiece & 0x01) === 0x01){ // pawn
        var direction = from - to > 0 ? 0x0 : 0x8;  
        var diff = Math.abs(from - to);
        var fromRow = from & 0x70;
        
        if( direction !== currentPlayer ){ // a pawn can only move forward
            log('not a valid pawn move');
            return false;
        }
        
        if(diff === 16 && !toPiece){  // single move forward?
            log('valid move forward');
        } else if(diff === 32 && !toPiece && (fromRow === 0x60 || fromRow === 0x10)){  // double move from start
            log('valid double move forward');
        } else if ((diff === 15 || diff === 17) && toPiece) {
            log('valid capture by pawn');
        } else {
            log('not a valid pawn move');
            return false;
        }
    }

    return true;
}

function makeMove(from, to){
    var capturedPiece = board[to];
    board[to] = board[from];
    board[from] = 0;
    currentPlayer = (currentPlayer === 0) ? 8 : 0;
    return capturedPiece;
}

function unMakeMove(from, to, capturedPiece){
    board[from] = board[to];    
    board[to] = capturedPiece;
    currentPlayer = (currentPlayer === 0) ? 8 : 0;
    return true;
}

function checkAfterMove(from, to){
    
}