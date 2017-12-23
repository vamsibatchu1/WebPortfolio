/**
 * Controller "Class" to act as a bridge between view and model.
 * @author Vamsi Batchu
 *
 * @constructor
 */
function GameOfLifeController() {
    this.grid = new Grid();
    this.gameOfLife = new GameOfLife();
    this.makeTableAndGrid(10, 20, true);
}

/**
 * Creates the table on the view and then creates the gameMatrix for the model.
 *
 * @param rows
 *      The number of rows
 * @param cols
 *      The number of cols.
 * @param random
 *      If this is a random population or not.
 */
GameOfLifeController.prototype.makeTableAndGrid = function (rows, cols, random) {
    this.grid.buildGrid(rows, cols, random);
    this.board = this.buildGameBoard(this.grid.getLatestGrid());
    this.gameOfLife.newGameBoard(this.board);
    this.gameOfLife.resetGeneration();
};

/**
 * Starts the game
 */
GameOfLifeController.prototype.startTheGame = function () {
    this.gameOfLife.startGame();
};

/**
 * Stops the game
 */
GameOfLifeController.prototype.stopTheGame = function () {
    this.gameOfLife.stopGame();
};

/**
 * Progresses the game one generation.
 */
GameOfLifeController.prototype.updateOneGeneration = function () {
    this.gameOfLife.setCellNextStatesForSingleGeneration();
};

/**
 * Progresses the game X number of generations.
 *
 * @param numberOfGenerations
 *      The number of generations the game is progressed.
 */
GameOfLifeController.prototype.updateXGenerations = function (numberOfGenerations) {
    for (var currGen = 0; currGen < numberOfGenerations; currGen++) {
        this.gameOfLife.setCellNextStatesForSingleGeneration();
    }
};

/**
 * Builds a new table for the game.
 *
 * @param rows
 *      The rows of the table.
 * @param cols
 *      The cols of the new table
 * @param random
 *      Bool parameter for if the population should be randomized or not.
 */
GameOfLifeController.prototype.buildNewTable = function (rows, cols, random) {
    this.makeTableAndGrid(rows, cols, random);
};

/**
 * Updates a single cell in the gameMatrix as the result of a click.
 *
 * @param id
 *      The id of the cell.
 * @param state
 *      The new state of the cell, ALIVE or DEAD!
 */
GameOfLifeController.prototype.updateASingleCell = function (id, state) {
    this.gameOfLife.updateSingleCell(id, state);
};

/**
 * Adds a row to the backend when the user adds a row on the view.
 */
GameOfLifeController.prototype.addRowToTheGrid = function () {
    this.grid.addRow();
    this.addRowToBoard();
    this.gameOfLife.newGameBoard(this.board);
};

/**
 * Adds a column to the backend when the user adds a col to the view.
 */
GameOfLifeController.prototype.addColumnToTheGrid = function () {
    this.grid.addColumn();
    this.addColumnToBoard();
    this.gameOfLife.newGameBoard(this.board);
};

/**
 * Removes a row to the backend when the user removes a row on the view.
 */
GameOfLifeController.prototype.removeRowFromGrid = function () {
    this.grid.removeRow();
    this.board.pop();
    this.gameOfLife.newGameBoard(this.board);
};

/**
 * Removes a column to the backend when the user removes a col to the view.
 */
GameOfLifeController.prototype.removeColumnFromGrid = function () {
    this.grid.removeColumn();
    this.board.forEach(function (boardRow) {
        boardRow.pop();
    });
    this.gameOfLife.newGameBoard(this.board);
};

/**
 * Dynamically builds the table for the view so that it matches the gameMatrix.
 * Also creates cell objects.
 *
 * @param grid
 *      The 2D matrix that is used in the model to represent the life of the cells.
 * @returns {Array}
 *      Returns the table.
 */
GameOfLifeController.prototype.buildGameBoard = function (grid) {

    var self = this;
    var gameTable = $("#gameTable");
    var currBoard = [];

    grid.forEach(function (row, yCoordinate) {
        var tr = $('<tr>');
        tr.attr('id', yCoordinate);

        currBoard.push(row.map(
            function (stateValue, xCoordinate) {

                var td = $('<td>');
                var tdId = 'x' + xCoordinate + 'y' + yCoordinate;

                td.attr('id', tdId);
                td.click(function () {
                    self.setUpClickEventForCell(td, self);
                });

                tr.append(td);
                gameTable.append(tr);

                return self.makeNewBoardElement(xCoordinate, yCoordinate, stateValue, td);
            }));
    });

    return currBoard;
};

/**
 * Adds row to the game board.
 */
GameOfLifeController.prototype.addRowToBoard = function () {

    var self = this;
    var gameGrid = this.grid.getLatestGrid();
    var yCoordinate = gameGrid.length - 1;

    var gameTable = $("#gameTable");
    var tr = $('<tr>');
    tr.attr('id', yCoordinate);

    self.board.push(gameGrid[gameGrid.length - 1].map(
        function (item, xCoordinate) {

            var td = $('<td>');
            var tdId = 'x' + xCoordinate + 'y' + yCoordinate;

            td.attr('id', tdId);
            td.click(function () {
                self.setUpClickEventForCell(td, self);
            });

            tr.append(td);
            gameTable.append(tr);

            return self.makeNewBoardElement(xCoordinate, yCoordinate, item, td);
        }));
};

/**
 * Adds column to the game board
 */
GameOfLifeController.prototype.addColumnToBoard = function () {
    var self = this;
    var gameBoard = this.board;
    var xCoord = document.getElementById('gameTable').rows[0].cells.length;
    var yCoord = 0;

    gameBoard.forEach(function (boardRow) {

        var trID = $('#' + yCoord + '');
        var tr = $(trID);
        var td = $('<td>');
        var tdId = 'x' + xCoord + 'y' + boardRow[0].y;
        td.attr('id', tdId);

        td.click(function () {
            self.setUpClickEventForCell(td, self);
        });

        var newBoardCell = self.makeNewBoardElement(xCoord, boardRow[0].y, StatesOfLife.DEAD, td);

        boardRow.push(newBoardCell);
        tr.append(td);
        yCoord++;
    });
};

/**
 * Functional method that makes board element
 *
 * @param xCoordinate
 *      The xCoordinate
 * @param yCoordinate
 *      The yCoordinate
 * @param initialState
 *      The cell's initial state
 * @param td
 *      The td on the HTML table.
 * @returns {{x: *, y: *, cellObject: Cell}}
 *      Returns a gameBoard "object."
 */
GameOfLifeController.prototype.makeNewBoardElement = function (xCoordinate, yCoordinate, initialState, td) {
    return {
        x: xCoordinate,
        y: yCoordinate,
        cellObject: new Cell(initialState, td)
    }
};

/**
 * Sets up click events on creation of each td cell.
 *
 * @param td
 *      The table cell (td) element.
 * @param self
 *      Making sure the scope of the controller class persists.
 */
GameOfLifeController.prototype.setUpClickEventForCell = function (td, self) {
    var tdId = td.attr('id');

    if (td.attr('class') === 'alive') {
        self.updateASingleCell(tdId, StatesOfLife.DEAD);
    } else {
        self.updateASingleCell(tdId, StatesOfLife.ALIVE);
    }
};