const iMax = 10;
const jMax = 10;
const dX = 50;
const dY = 50;

const initialAmount = 3;

var x_position = 0;
var y_position = 0;

function fieldDrower(rows, columns) {
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < columns; j++) {
            if (i === 0 || j === 0 || i === iMax - 1 || j === jMax - 1) {
                let el1 = $('<div style="position: absolute; width: ' + dX + 'px; height: ' + dY + 'px;" data-x="' + i + '" data-y="' + j + '" data-type="#" data-envir="1" title="Забор">#</div>');
                $('body').append(el1.offset({ top: dY * j, left: dX * i }));
            } else {
                let el1 = $('<div style="position: absolute; width: ' + dX + 'px; height: ' + dY + 'px;" data-x="' + i + '" data-y="' + j + '" data-type="space" data-envir="1">&nbsp;</div>');
                $('body').append(el1.offset({ top: dY * j, left: dX * i }));
                //$('body').append('<div style="position: absolute; width: ' + dX + 'px; height: ' + dY + 'px;" data-x="' + i + '" data-y="' + j + '" data-type="space" data-envir="1">&nbsp;</div>').offset({ top: dY * j, left: dX * i });
            }
        }
    }
}
function setToPos() {
    $('[data-type = space][data-type = #]').each(function (n, e) {
        let el = $(e);
        let x = dX * el.data('x');
        let y = dY * el.data('y');
        el.offset({ top: x, left: y });
    });
}
function getRandomPosition() {
    x_position = Math.floor(Math.random() * 10);
    y_position = Math.floor(Math.random() * 10);
    return {
        X: x_position, Y: y_position
    };
}
function initEnvironment() {
    let i = 0;
    let j = 0;
    let k = 0;
    while (i < initialAmount) {
        let pos = getRandomPosition();
        let elSpace = $('[data-type = space][data-x = ' + pos.X + '][data-y = ' + pos.Y + ']');
        if (elSpace.length > 0 && elSpace.children().length === 0) {
            $(elSpace).append('<div style="display: inline-block; position: relative; width: 100%; height:100%; margin-left: -4px;" data-x="' + pos.X + '" data-y="' + pos.Y + '" data-type="*" data-envir="1" title="Трава">*</div>');
            i++;
        }
    }
    while (j < initialAmount) {
        let pos = getRandomPosition();
        let elSpace = $('[data-type = space][data-x = ' + pos.X + '][data-y = ' + pos.Y + ']');
        if (elSpace.length > 0 && elSpace.children().length === 0) {
            $(elSpace).append('<div style="display: inline-block; position: relative; width: 100%; height:100%; margin-left: -4px;" data-x="' + pos.X + '" data-y="' + pos.Y + '" data-type="O" data-envir="1" title="Травоядное">O</div>');
            j++;
        }
    }
    while (k < initialAmount) {
        let pos = getRandomPosition();
        let elSpace = $('[data-type = space][data-x = ' + pos.X + '][data-y = ' + pos.Y + ']');
        if (elSpace.length > 0 && elSpace.children().length === 0) {
            $(elSpace).append('<div style="display: inline-block; position: relative; width: 100%; height:100%; margin-left: -4px;" data-x="' + pos.X + '" data-y="' + pos.Y + '" data-type="A" data-envir="1" title="Хищник">A</div>');
            k++;
        }
    }
}
function setDraggablePA() {
    //для травоядных
    $('[data-type = O]').draggable({
        start: function (e, ui) {
            $('.ui-droppable').removeClass('ui-droppable');
            console.log('start drag', e, ui);
            let p1 = $(this).parent();
            let x = +p1.data('x');
            let y = +p1.data('y');
            for (var i = x - 1; i <= x + 1; i++) {
                for (var j = y - 1; j <= y + 1; j++) {
                    if (i !== x || j !== y) {
                        let targetCell = $('[data-x = ' + i + ' ][data-y = ' + j + ']');
                        if (targetCell.length > 0 && targetCell.html() !== '#') {
                            let contentTarget = targetCell.children();
                            if (contentTarget.length === 0 || contentTarget.data('type') === '*') {
                                console.log(contentTarget.length, contentTarget.data('type'));
                                $(targetCell).droppable({
                                    drop: function (e, ui) {
                                        console.log('drop', e, ui);
                                        let elPp1 = ui.draggable.clone();
                                        $(this).html('');
                                        $(this).append(elPp1);
                                        ui.draggable.parent().html('');
                                        setDraggablePA();
                                    }
                                });
                            }
                        }
                    }
                }
            }
        }, helper: 'clone'
    });
}

function setDraggableMA() {
    //для хищников
    $('[data-type = A]').draggable({
        start: function (e, ui) {
            $('.ui-droppable').removeClass('ui-droppable');
            console.log('start drag', e, ui);
            let p1 = $(this).parent();
            let x = +p1.data('x');
            let y = +p1.data('y');
            for (var i = x - 1; i <= x + 1; i++) {
                for (var j = y - 1; j <= y + 1; j++) {
                    if (i !== x || j !== y) {
                        let targetCell = $('[data-x = ' + i + ' ][data-y = ' + j + ']');
                        if (targetCell.length > 0 && targetCell.html() !== '#') {
                            let contentTarget = targetCell.children();
                            if (contentTarget.length === 0 || contentTarget.data('type') === 'O') {
                                console.log(contentTarget.length, contentTarget.data('type'));
                                $(targetCell).droppable({
                                    drop: function (e, ui) {
                                        console.log('drop', e, ui);
                                        let elPp1 = ui.draggable.clone();
                                        $(this).html('');
                                        $(this).append(elPp1);
                                        ui.draggable.parent().html('');
                                        setDraggableMA();
                                    }
                                });
                            }
                        }
                    }
                }
            }
        }, helper: 'clone'
    });
}

$(document).ready(function () {
    fieldDrower(10, 10);
    initEnvironment();
    setDraggablePA();
    setDraggableMA();
});