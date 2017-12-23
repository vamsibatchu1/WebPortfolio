/**
 * Model "Class" that sets up the grid 2D array for use to build the game board.
 * @constructor
 */
function Grid() {
    this.grid = [];
}

/**
 * Builds the gameMatrix - a 2D array - of 0s and 1s to denote dead or alive for each cell.
 * @param rowSize
 *      The number of rows.
 * @param colSize
 *      The number of columns
 * @param random
 *      If this population should be randomized.
 * @returns {Array}
 *      Returns an Array of Arrays that contains 0s or 1s.
 */
Grid.prototype.buildGrid = function (rowSize, colSize, random) {

    if (this.grid.length > 0) {
        this.grid = [];
    }

    for (var currRow = 0; currRow < rowSize; currRow++) {
        var row = [];
        for (var currColumn = 0; currColumn < colSize; currColumn++) {
            if (random) {
                var startCondition = Math.round(Math.random() * 0.7);
                row.push(startCondition);
            }
            else {
                row.push(0);
            }
        }
        this.grid.push(row);
    }
    return this.grid;
};

/**
 * Gets the latest grid
 * @returns {Array}
 *  The array 0s and 1s made for the initial population.
 */
Grid.prototype.getLatestGrid = function () {
    return this.grid;
};

/**
 * Removes a row from the grid.
 */
Grid.prototype.removeRow = function () {
    this.grid.pop();
};

/**
 * Removes a columm from the grid.
 */
Grid.prototype.removeColumn = function () {
    this.grid.forEach(function (row) {
        row.pop();
    });
};

/**
 * Adds row to grid.
 */
Grid.prototype.addRow = function () {
    var newRow = [];
    for (var index = 0; index < this.grid[0].length; index++) {
        newRow.push(0);
    }
    this.grid.push(newRow);
};

/**
 * Adds column to grid
 */
Grid.prototype.addColumn = function () {
    this.grid.forEach(function (row) {
        row.push(0);
    });
};