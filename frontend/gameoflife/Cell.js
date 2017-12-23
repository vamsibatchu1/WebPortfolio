/**
 * Cell "Class" that contains its current liveliness and its next state.
 *
 * @param initialState
 *      The initial state: alive, dead, etc.
 * @param tableCell
 *      The reference to the table cell in the view.
 * @constructor
 */
function Cell(initialState, tableCell) {
    this.tableCell = tableCell;
    this.nextState = initialState;
    this.setMortality(initialState);
}

/**
 * Getter method to return if cell is alive.
 * @returns True if alive, false otherwise.
 */
Cell.prototype.getProofOfLife = function () {
    return this.isAlive;
};

/**
 * Sets the liveliness of cell
 *
 * @param alive
 *      The liveliness of the cell, 1 if alive, 0 otherwise
 */
Cell.prototype.setMortality = function (alive) {
    this.isAlive = alive;

    if (!alive) {
        this.tableCell.removeClass('alive');
    } else {
        this.tableCell.addClass('alive');
    }
};


