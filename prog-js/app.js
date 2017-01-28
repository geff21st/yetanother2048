var CELLS_CNT = 4;
var CELL_CLS = 'cell';
var CELL_SEL = '.' + CELL_CLS;
var CELL_ITEM_SEL = '.' + CELL_CLS + '-wrap';
var BOX_CLS = 'box';
var BOX_SEL = '.' + BOX_CLS;
var ATTR_COUNTER = 'data-counter';

var initField = function() {

    window.cells = [];

    var $_tpl_cell = $(CELL_ITEM_SEL + ':first');
    var $box = $(BOX_SEL);
    $box.html('');



    for(var i = 0; i < CELLS_CNT; i++) {
        cells[i] = [];
        for(var j = 0; j < CELLS_CNT; j++) {
            var $cell = $_tpl_cell.clone();
            $cell.appendTo($box)
            cells[i][j] = {
                value: 0,
                el: $cell,
                cell: $cell.find(CELL_SEL)
            };
            // console.log(i + ' : ' + j)
        }
    }
    // console.log(cells)
};

var setValues = function() {
    for(var i = 0; i < cells.length; i++) {
        for(var j = 0; j < cells[i].length; j++) {
            cells[i][j]
                .cell
                .attr(ATTR_COUNTER, cells[i][j].value);
        }
    }
};

$(function(){

    initField();

    goThroughTable(function(i, j){
        var _i = CELLS_CNT * i + j + 1;
        if(_i > 13) return;
        cells[i][j].value = Math.pow(2, _i);
    });

    setValues();
});

var goThroughTable = function(callBack) {
    if(!$.isFunction(callBack)) return;
    for(var i = 0; i < cells.length; i++) {
        for(var j = 0; j < cells[i].length; j++) {
            callBack(i, j);
        }
    }
};