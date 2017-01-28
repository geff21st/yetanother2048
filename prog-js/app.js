function Helper() { }

Helper.__log = function() {
    console.log(arguments);
};

Helper.nearestPow2 = function(num) {
    return Math.pow(
        2,
        Math.round(
            Math.log( num ) /
            Math.log( 2 )
        )
    );
};




//class Field
function Field(size, min_val) {
    this.CELLS_CNT = Math.floor(size) || 4;

    this.CELL_CLS = 'cell';
    this.CELL_SEL = '.' + this.CELL_CLS;
    this.CELL_ITEM_SEL = '.' + this.CELL_CLS + '-wrap';

    this.BOX_CLS = 'box';
    this.BOX_SEL = '.' + this.BOX_CLS;

    this.BTN_SEL = '.btn';
    this.LEFT_BTN_SEL = this.BTN_SEL + '_move-left';

    this.ATTR_COUNTER = 'data-counter';
    this.MIN_VAL = Math.floor(min_val)|| 2;

    this.cells = [];

    this.init();
    this.setCallbacks();
}


Field.prototype.init = function() {
    var $_tpl_cell = $(this.CELL_ITEM_SEL + ':first');
    var $box = $(this.BOX_SEL);
    $box.html('');

    for(var i = 0; i < this.CELLS_CNT; i++) {
        this.cells[i] = [];
        for(var j = 0; j < this.CELLS_CNT; j++) {
            var $cell = $_tpl_cell.clone();
            $cell.appendTo($box)
            this.cells[i][j] = {
                value: 0,
                el: $cell,
                cell: $cell.find(this.CELL_SEL)
            };
        }
    }

    this.value(0, 0, this.MIN_VAL);
    this.addInRandCell();
    this.setValues();
};


Field.prototype.setValues = function() {
    var _this = this;
    this.goThroughTable(function (i, j) {
        _this.cells[i][j]
            .cell
            .attr(
                _this.ATTR_COUNTER,
                _this.value(i, j)
            );
    });
};


Field.prototype.goThroughTable = function(callBack) {
    if(!$.isFunction(callBack)) return;
    for(var i = 0; i < this.cells.length; i++) {
        for(var j = 0; j < this.cells[i].length; j++) {
            callBack(i, j);
        }
    }
};


Field.prototype.row = function(i) {
    return this.cells[i];
};


Field.prototype.value = function(i, j, value) {
    if(arguments.length > 2) {
        this.cells[i][j].value = Helper.nearestPow2(value);
    } else {
        return this.cells[i][j].value;
    }
};


Field.prototype.addInRandCell = function(value) {
    var i = Math.floor(Math.random() * this.CELLS_CNT);
    var j = Math.floor(Math.random() * this.CELLS_CNT);

    Helper.__log(i, j);

    if (this.value(i, j)) {
        return this.addInRandCell();
    } else {
        value = value || this.MIN_VAL;
        this.value(i, j, Helper.nearestPow2(value));
    }
};


Field.prototype.moveRowLeft = function(i) {

    var prev = [false, false];
    var row = this.row(i);


    for (var j = row.length - 1, val; j >= 0; j--) {
        val = this.value(i, j);

        if(!val) continue;

        if(false !== prev[0] && val === prev[1]) {

            this.value(i, j, val*2);
            this.value(i, prev[0], 0);

        }

        prev = [j, val];
    }
};


Field.prototype.moveLeft = function() {
    for (var i = 0; i < this.CELLS_CNT; i++) {
        this.moveRowLeft(i);
    }

    this.setValues();
};


Field.prototype.setCallbacks = function() {
    var _this = this;
    var CLICK_NAME = 'click.2048_left';
    $(document)
        .off(CLICK_NAME)
        .on(CLICK_NAME, this.LEFT_BTN_SEL, function(e) {
            e.preventDefault();
            _this.moveLeft();
        });
};



$(function(){

    window.__field = new Field;



    window.__field.value(0, 1, 2);
    window.__field.value(0, 2, 2);
    window.__field.value(0, 3, 2);


    window.__field.value(1, 0, 4);
    window.__field.value(1, 1, 0);
    window.__field.value(1, 2, 4);
    window.__field.value(1, 3, 4);



    window.__field.setValues();

    console.log(__field.cells)

});