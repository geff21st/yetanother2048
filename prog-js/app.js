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
    this.UP_BTN_SEL = this.BTN_SEL + '_move-up';

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
    } else if(this.cells[i] == null || this.cells[i][j] == null) {
        return false;
    } else {
        return this.cells[i][j].value;
    }
};


Field.prototype.addInRandCell = function(value) {
    var i = Math.floor(Math.random() * this.CELLS_CNT);
    var j = Math.floor(Math.random() * this.CELLS_CNT);

    Helper.__log(i, j);

    // this.value(3, 3, 2);
    // return;

    if (this.value(i, j)) {
        return this.addInRandCell();
    } else {
        value = value || this.MIN_VAL;
        this.value(i, j, Helper.nearestPow2(value));
    }
};


Field.prototype.countOneIteration = function(i, j, index, prevVal, chainLen, newRow) {
    var val = this.value(i, j);

    console.log(
        'val:' + val, '   ',
        'prevVal:' + prevVal, '   ',
        'chainLen:' + chainLen, '   ',
        'newRow:' + newRow.join(';')
    );

    if(false !== prevVal) {
        if((val && val !== prevVal) || index === this.CELLS_CNT) {
            newRow.push(prevVal * chainLen);
            chainLen = 0;
        }
    }

    if(val) {
        prevVal = val;
        chainLen++;
    }

    return [prevVal, chainLen, newRow];
};


Field.prototype.countRowHorizontal = function(i) {

    var info = false;
    var prevVal = false;
    var chainLen = 0;
    var newRow = [];

    for (var j = 0; j <= this.CELLS_CNT; j++) {

        info = this.countOneIteration(i, j, j, prevVal, chainLen, newRow);
        prevVal = info[0];
        chainLen = info[1];
        newRow = info[2];

    }

    return newRow;
};


Field.prototype.countRowVertical = function(j) {

    var info = false;
    var prevVal = false;
    var chainLen = 0;
    var newRow = [];

    for (var i = 0; i <= this.CELLS_CNT; i++) {

        info = this.countOneIteration(i, j, i, prevVal, chainLen, newRow);
        prevVal = info[0];
        chainLen = info[1];
        newRow = info[2];

    }

    return newRow;
};


Field.prototype.moveLeft = function() {
    var newRow, val;
    for (var i = 0; i < this.CELLS_CNT; i++) {
        newRow = this.countRowHorizontal(i);
        for (var j = 0; j < this.CELLS_CNT; j++) {
            val = newRow[j] == null ? false : newRow[j];
            this.value(i, j, val);
        }
    }
    this.addInRandCell();
    this.setValues();
};


Field.prototype.moveUp = function() {
    var newRow, val;
    for (var j = 0; j < this.CELLS_CNT; j++) {
        newRow = this.countRowVertical(j)
        for (var i = 0; i < this.CELLS_CNT; i++) {
            val = newRow[i] == null ? false : newRow[i];
            this.value(i, j, val);
        }
    }
    this.addInRandCell();
    this.setValues();
};


Field.prototype.setCallbacks = function() {
    var _this = this;
    var CLICK_PRFX = 'click.2048_';
    var CLICK_UP = CLICK_PRFX + '_up';
    var CLICK_RIGHT = CLICK_PRFX + '_right';
    var CLICK_DOWN = CLICK_PRFX + '_down';
    var CLICK_LEFT = CLICK_PRFX + '_left';

    $(document)
        .off(CLICK_LEFT).on(CLICK_LEFT, this.LEFT_BTN_SEL, function(e) {
            e.preventDefault();
            _this.moveLeft();
        })

        .off(CLICK_UP).on(CLICK_UP, this.UP_BTN_SEL, function(e) {
            e.preventDefault();
            _this.moveUp();
        })
        ;
};



$(function(){

    window.__field = new Field;



    window.__field.value(0, 1, 2);
    window.__field.value(0, 2, 2);
    window.__field.value(0, 3, 2);


    window.__field.value(1, 0, 4);
    window.__field.value(1, 1, 4);
    window.__field.value(1, 2, 8);
    window.__field.value(1, 3, 8);

    window.__field.value(2, 0, 8);
    window.__field.value(2, 1, 4);
    // window.__field.value(1, 2, 8);
    window.__field.value(2, 3, 4);

    window.__field.value(3, 1, 4);


    window.__field.setValues();

    console.log(__field.cells)

});