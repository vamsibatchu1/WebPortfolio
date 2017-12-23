/**
 * View class that acts on the front end of the application.
 * @author Vamsi Batchu
 *
 * @constructor
 */
function GameOfLifeView() {
    this.controller = new GameOfLifeController();
}

/**
 * Button event for starting the game.
 */
GameOfLifeView.prototype.startGame = function () {
    this.controller.startTheGame();
};

/**
 * Button even for stopping the game.
 */
GameOfLifeView.prototype.stopGame = function () {
    this.controller.stopTheGame();
};

/**
 * Updates the population by one generation.
 */
GameOfLifeView.prototype.incrementOneGeneration = function () {
    this.controller.updateOneGeneration();
};

/**
 * Updates the population by 23 generations
 */
GameOfLifeView.prototype.incrementTwentyThreeGenerations = function () {
    this.controller.updateXGenerations(23);
};

/**
 * Resets the game with generation and population being 0.
 */
GameOfLifeView.prototype.resetTheGame = function () {
    var table = document.getElementById('gameTable');
    var rows = table.rows.length;
    var cols = table.rows[0].cells.length;

    this.clearTable();

    this.controller.buildNewTable(rows, cols, false);
};

/**
 * Starts the game over with a random population.
 */
GameOfLifeView.prototype.randomPopulation = function () {
    var table = document.getElementById('gameTable');
    var rows = table.rows.length;
    var cols = table.rows[0].cells.length;

    this.clearTable();
    this.controller.buildNewTable(rows, cols, true);
};

/**
 * Builds new table based on text input.
 * @param rows
 *      The number of rows.
 * @param cols
 *      The number of columns.
 */
GameOfLifeView.prototype.buildVariableSizedTable = function (rows, cols) {

    this.clearTable();
    this.controller.buildNewTable(rows, cols, false);
};

/**
 * Adds row to table dynamically based on user interaction.
 */
GameOfLifeView.prototype.addRow = function () {
    this.controller.addRowToTheGrid();
};

/**
 * Adds column to table dynamically based on user interaction.
 */
GameOfLifeView.prototype.addColumn = function () {
    this.controller.addColumnToTheGrid();
};

/**
 * Deletes the last row of table dynamically based on user interaction.
 */
GameOfLifeView.prototype.deleteLastRow = function () {
    var table = document.getElementById('gameTable');

    if (table.rows.length <= 1) {
        alert("Cannot delete entire table");
    } else {
        table.deleteRow(table.rows.length - 1);
        this.controller.removeRowFromGrid();
    }
};

/**
 * Deletes the last column of table dynamically based on user interaction.
 */
GameOfLifeView.prototype.deleteLastColumn = function () {
    var table = document.getElementById('gameTable');
    if (table.rows[0].cells.length <= 1) {
        alert("Cannot delete entire table");
    } else {
        for (var currRow = 0; currRow < table.rows.length; currRow++) {
            table.rows[currRow].deleteCell(table.rows[currRow].cells.length - 1);
        }
        this.controller.removeColumnFromGrid();
    }
};

/**
 * Clears the table by overwriting the <tbody> element of the <table>
 */
GameOfLifeView.prototype.clearTable = function () {
    var old_tbody = document.querySelector('tbody');
    var new_tbody = document.createElement('tbody');
    old_tbody.parentNode.replaceChild(new_tbody, old_tbody);
};