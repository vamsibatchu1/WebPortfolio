/**
 * "Main" method to start up everything.
 *
 * @author: Vamsi Batchu
 */
$(function () {
    var view = new GameOfLifeView();
    setUpButtonEvents(view);
});

/**
 * Sets up binding of view "class" and the button elements in HTML.
 * @param view
 *      The view instance that ties these events to the view.
 */
function setUpButtonEvents(view) {

    var startButton = document.getElementById('startButton');
    var stopButton = document.getElementById('stopButton');
    var incrementOne = document.getElementById('incrementOne');
    var increment23 = document.getElementById('increment23');
    var resetGame = document.getElementById('resetGame');
    var randomPopulation = document.getElementById('randomPopulation');
    var addRow = document.getElementById('addRow');
    var addCol = document.getElementById('addCol');
    var deleteRow = document.getElementById('deleteRow');
    var deleteCol = document.getElementById('deleteCol');
    var buildNewVariableTable = document.getElementById('buildNewVariableTable');

    startButton.addEventListener('click', function () {
        toggleInterferingButtons(true);
        view.startGame();
    });

    stopButton.addEventListener('click', function () {
        toggleInterferingButtons(false);
        view.stopGame()
    });

    incrementOne.addEventListener('click', function () {
        view.incrementOneGeneration();
    });

    increment23.addEventListener('click', function () {
        view.incrementTwentyThreeGenerations();
    });

    resetGame.addEventListener('click', function () {
        view.resetTheGame();
    });

    randomPopulation.addEventListener('click', function () {
        view.randomPopulation();
    });

    addRow.addEventListener('click', function () {
        view.addRow();
    });

    addCol.addEventListener('click', function () {
        view.addColumn();
    });

    deleteRow.addEventListener('click', function () {
        view.deleteLastRow();
    });

    deleteCol.addEventListener('click', function () {
        view.deleteLastColumn();
    });

    buildNewVariableTable.addEventListener('click', function () {
        var rows = document.getElementById('rowsInput').value;
        var columns = document.getElementById('colsInput').value;

        if (rows === null || rows === "" || columns === null || columns === "") {
            alert("Both columns and rows must be filled.");
        } else {
            view.buildVariableSizedTable(rows, columns);
        }
    });
}

/**
 * Toggles "disabled" tag on buttons when game is running.
 * @param boolValue
 *      True or false. When true, buttons will not be click-able, false they will be.
 */
function toggleInterferingButtons(boolValue) {

    var incrementOne = document.getElementById('incrementOne');
    var increment23 = document.getElementById('increment23');
    var resetGame = document.getElementById('resetGame');
    var randomPopulation = document.getElementById('randomPopulation');
    var addRow = document.getElementById('addRow');
    var addCol = document.getElementById('addCol');
    var deleteRow = document.getElementById('deleteRow');
    var deleteCol = document.getElementById('deleteCol');
    var buildNewVariableTable = document.getElementById('buildNewVariableTable');

    incrementOne.disabled = boolValue;
    increment23.disabled = boolValue;
    resetGame.disabled = boolValue;
    randomPopulation.disabled = boolValue;
    addRow.disabled = boolValue;
    addCol.disabled = boolValue;
    deleteRow.disabled = boolValue;
    deleteCol.disabled = boolValue;
    buildNewVariableTable.disabled = boolValue;
}





