/*basic utils used in the js*/
// usage: log('inside coolFunc',this,arguments);
// paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
window.log = function() {
    log.history = log.history || []; // store logs to an array for reference
    log.history.push(arguments);
    if (this.console) {
        console.log(Array.prototype.slice.call(arguments));
    }
}

function getPieceName(pieceValue){
    switch (pieceValue) {
        case WHITE_KING: return 'WHITE_KING';
        case WHITE_QUEEN: return 'WHITE_QUEEN';
        case WHITE_ROOK: return 'WHITE_ROOK';
        case WHITE_BISHOP: return 'WHITE_BISHOP';
        case WHITE_KNIGHT: return 'WHITE_KNIGHT';
        case WHITE_PAWN: return 'WHITE_PAWN';
        
        case BLACK_KING: return 'BLACK_KING';
        case BLACK_QUEEN: return 'BLACK_QUEEN';
        case BLACK_ROOK: return 'BLACK_ROOK';
        case BLACK_BISHOP: return 'BLACK_BISHOP';
        case BLACK_KNIGHT: return 'BLACK_KNIGHT';
        case BLACK_PAWN: return 'BLACK_PAWN';
        
        default: return 'EMPTY';
    }
}

var onDrop = function(event, ui) {

    var from = ui.draggable.parent().data('square');
    var to = $(this).data('square');
    
    if(validateMove(from, to, currentPlayer)){
        makeMove(from, to);
    }else{
        // don't touch the board.
    }
    setTimeout(function(){drawBoard(board);},50);
}

$(function(){
    drawBoard(board);
});

function drawBoard(board){
    var str = '';
    
    var showsDummyBoard = false;
    var showsSquareNumbers = false;
    
    var whichPlayer = true;
    var incr = whichPlayer ? 1 : -1;
    var start = whichPlayer ? 0 : 127;
    var end = whichPlayer ? 128 : -1;
    var rowStart = whichPlayer ? 0 : 15;
    var rowEnd = whichPlayer ? 15 : 0;
    
    
    for( var i = start ; i !== end ; i+= incr ){
        if( i % 16 === rowStart ) {
            str += '<div class="row">';
        }
        
        if(! (i & 0x88) ) {
            str += '<div class="column ' +
            ( (i & 0x1) ^ ((i >> 4)  & 0x1) ? 'light': 'dark') +
            '" data-square="' + i + '">' +
                '<div class="' + getPieceName(board[i]) + '">' +
                (showsSquareNumbers ? i.toString(16).toUpperCase() : '') +
                '</div>' +
            '</div>';
        }else if(showsDummyBoard){
            str += '<div class="column off ' +
            ( (i & 0x1) ^ ((i >> 4)  & 0x1) ? 'light': 'dark') +
            '" data-square="' + i + '">' +
                '<div class="' + getPieceName(board[i]) + '">' +
                (showsSquareNumbers ? i.toString(16).toUpperCase() : '') +
                '</div>' +
            '</div>';
        }
        
        if( i % 16 === rowEnd ) {
            str += '</div>';
        }
    }

    $('#board').html(str);
    
    $( ".column" ).droppable({
        drop: onDrop
    });
    
    $( ".column div" ).draggable({ revert: 'invalid' });
    
    var FEN = boardToFEN(board);
    saveFEN(FEN);

}

function boardToFEN(board){
    var piece, emptySquares = 0, FEN = '';
    for(var i=0; i< 128; i++){
        if(! (i & 0x88) ) {
            var n = board[i];
            if((n & 0x07) === 0x07){ // queen
                piece = 'Q';
            }else if((n & 0x06) === 0x06){ // rook
                piece = 'R';
            }else if((n & 0x05) === 0x05){ // bishop
                piece = 'B';
            }else if((n & 0x03) === 0x03){ // king
                piece = 'K';
            }else if((n & 0x02) === 0x02){ // knight
                piece = 'N';
            }else if((n & 0x01) === 0x01){ // pawn
                piece = 'P';
            }
            
            if(n === 0){ // empty square
                piece = '';
                emptySquares++;
            }else{
                piece = emptySquares ? emptySquares + piece : piece;                
                emptySquares = 0;
            }
            
            if(n & 0x08){
                piece = piece.toLowerCase();
            }
            
            FEN += piece;
            
            if(i % 8 === 7){ // end of rank
                if(n === 0){
                   FEN += emptySquares;
                }
                emptySquares = 0;
                FEN += '/';
            }
        }
    }
    
    //whose turn?
    
    FEN = FEN.substr(0, FEN.length - 1) + ' ';
    FEN += currentPlayer === WHITE ? 'w' : 'b';
    FEN += ' KQkq - 0 0';
    
    log(FEN);
    
    return FEN;
}


function saveFEN(FEN){
    $.ajax({
        type: 'POST',
        url: '/py',
        data: FEN
    }); 
}