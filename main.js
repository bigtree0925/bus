////////////////////////////////////////////////////////////
//                   Configuration                        //
////////////////////////////////////////////////////////////
var dat = document.getElementsByTagName('td');
var numOfColumns = document.getElementsByTagName('tr').length;
var numOfRows = document.getElementsByTagName('tr').length;
var currIndex = 0;
var rowObj = document.getElementsByTagName('tr');
var oneColLength = rowObj[0].children.length;
var colObj = document.getElementsByTagName('td');
var totalData = rowObj.length * colObj.length;
var dataCounter = 0;
var matrixObj = new Array(rowObj.length);
var currentX = 0;
var currentY = 0;
var currentDirection = null;
var buttons = document.getElementsByTagName('button');

//Setup matrix for the car parking
for (var i = 0; i < matrixObj.length; i++) {
    matrixObj[i] = new Array(oneColLength);
}
for (var i = 0; i < numOfRows; i++) {
    for (var j = 0; j < oneColLength; j++) {
        matrixObj[i][j] = colObj[dataCounter++];
    }
}
////////////////////////////////////////////////////////////

//Search class name with Regular Expression 
$.fn.removeClassStartingWith = function(filter) {
    $(this).removeClass(function(index, className) {
        return (className.match(new RegExp("\\S*" + filter + "\\S*", 'g')) || []).join(' ')
    });
    return this;
};

//Run command with Enter key on the input field
$('#bus-form').on('keypress', function(e) {
    var keyCode = e.keyCode || e.which;
    if (keyCode === 13) {
        e.preventDefault();
        runCommand();
        return false;
    }
});


function runCommand() {
    var busInputCommand = $('#bus-command').val().toLowerCase();

    //reset bus direction
    removeAllBus();

    //left command
    if (busInputCommand.indexOf('left') != -1) {
        updateDirectionLeft();
    } else if (busInputCommand.indexOf('right') != -1) {
        updateDirectionRight();
    } else if (busInputCommand.indexOf('report') != -1) {
        displayReport();
        //Move command
    } else if (busInputCommand.indexOf('move') != -1) {

        if (currentDirection === 'north') {
            moveNorth();
        } else if (currentDirection === 'east') {
            moveEast();
        } else if (currentDirection === 'south') {
            moveSouth();
        } else if (currentDirection === 'west') {
            moveWest();
        } else {
            moveEast();
        }


        //Place command
    } else if (busInputCommand.indexOf('place') != -1) {

        var resArray = busInputCommand.split(",");
        var targetX = resArray[0].replace('place ', '');
        var targetY = resArray[1];
        targetY = Math.abs(targetY - 4);
        currentX = targetX;
        currentY = targetY;
        $(matrixObj[targetY][targetX]).addClass('bus');

        //update direction
        var directionArr = ["north", "east", "south", "west"];


        $.each(directionArr, function(i, value) {
            if (busInputCommand.indexOf(value) != -1) {
                currentDirection = value;
            }
        });
    }
    repaint();
}

function updateDirectionLeft() {
    if (currentDirection === 'north') {
        currentDirection = 'west';
    } else if (currentDirection === 'east') {
        currentDirection = 'north';
    } else if (currentDirection === 'south') {
        currentDirection = 'east';
    } else if (currentDirection === 'west') {
        currentDirection = 'south';
    } else {
        currentDirection = 'east';
    }
}

function updateDirectionRight() {
    if (currentDirection === 'north') {
        currentDirection = 'east';
    } else if (currentDirection === 'east') {
        currentDirection = 'south';
    } else if (currentDirection === 'south') {
        currentDirection = 'west';
    } else if (currentDirection === 'west') {
        currentDirection = 'north';
    } else {
        currentDirection = 'east';
    }
}

function displayReport() {
    var displayY = Math.abs(currentY - 4);

    var message = 'X = ' + currentX + '\n' +
        'Y = ' + displayY + '\n' +
        'Direction = ' + currentDirection + '\n';
    alert(message);
}


function removeAllBus() {
    for (var i = 0; i < dat.length; i++) {
        $(dat[i]).removeClass('bus');
        $(dat[i]).removeClassStartingWith('bus-');
    }
}

function repaint() {
    removeAllBus();
    $(matrixObj[currentY][currentX]).addClass('bus');
    $('#carpark-area .bus').removeClassStartingWith('bus-');
    $('#carpark-area .bus').addClass('bus-' + currentDirection);

}

function moveNorth() {
    if (currentY > 0) {
        currentY--;
    }
}

function moveEast() {
    if (currentX < oneColLength - 1) {
        currentX++;
    }
}

function moveSouth() {
    if (currentY < matrixObj.length - 1) {
        currentY++;
    }
}

function moveWest() {
    if (currentX > 0) {
        currentX--;
    }
}

//Init position
$('#bus-command').val('PLACE 0,0,East');
runCommand();