/**
 * Game of life "Class" that handles the "back end" work of the game.
 * @author Vamsi Batchu.
 *
 @constructor
 */
function GameOfLife() {

    this.populationThreshold = 2;
    this.livesOnTwo = 2;
    this.livesOnThree = 3;
    this.resurrectionThreshold = 3;
    this.overCrowdingThreshold = 3;

    this.currGeneration = 0;
    this.generationText = $('#generationCount');
    this.generationText.text(this.currGeneration);

    this.population = 0;
    this.populationText = $('#populationCount');

    this.currBoard = [];
    this.keepWorking = false;
}

/**
 * Makes the currBoard build from the controller, and sets it to the model.
 *
 * @param board
 *      The 2D array that is a game board.
 */
GameOfLife.prototype.newGameBoard = function (board) {
    this.currBoard = board;
    this.getPopulation();
};

/**
 * Starts the game
 */
GameOfLife.prototype.startGame = function () {
    if (this.currGeneration === 0) {
        this.currGeneration = 1;
    }

    this.keepWorking = true;
    this.generationText.text(this.currGeneration);
    var self = this;

    setInterval(function () {
        self.setNextCellStates();
    }, 500);
};

/**
 * Stops the game.
 */
GameOfLife.prototype.stopGame = function () {
    this.keepWorking = false;
};

/**
 * Counts the living population at any given time.
 */
GameOfLife.prototype.getPopulation = function () {
    var localBoard = this.currBoard;
    var aliveCount = 0;

    localBoard.forEach(function (row) {
        row.forEach(function (cell) {
            aliveCount += cell.cellObject.getProofOfLife();
        });
    });

    this.updatePopulation(aliveCount);
};

/**
 * Updates the population when a single cell is clicked on
 * @param newPopulation
 *      The new population of the game.
 */
GameOfLife.prototype.updatePopulation = function (newPopulation) {
    this.population = newPopulation;
    this.populationText.text(this.population);
};

/**
 * Method to allow single update of table bypassing the boolean block that is used to stop the game.
 */
GameOfLife.prototype.setCellNextStatesForSingleGeneration = function () {

    if (this.currGeneration === 0) {
        this.currGeneration = 1;
    }

    this.keepWorking = true;
    this.setNextCellStates();
    this.keepWorking = false;
};

/**
 * Sets the "next" state of life for every cell based on their neighbors.
 */
GameOfLife.prototype.setNextCellStates = function () {

    if (!this.keepWorking) {
        return;
    }

    var self = this;
    var localBoard = this.currBoard;

    localBoard.forEach(function (currRow, yCoordinate) {
        currRow.forEach(function (currCell, xCoordinate) {

            var neighbors = self.getNeighbors(xCoordinate, yCoordinate);
            var livingNeighbors = 0;

            neighbors.forEach(function (currNeighbor) {
                livingNeighbors += currNeighbor.cellObject.getProofOfLife();
            });

            if (currCell.cellObject.getProofOfLife()) {

                // Starvation
                if (livingNeighbors < self.populationThreshold) {
                    currCell.cellObject.nextState = StatesOfLife.DEAD;
                }

                //Overcrowding
                else if (livingNeighbors > self.overCrowdingThreshold) {
                    currCell.cellObject.nextState = StatesOfLife.DEAD;
                }

                //Lives on
                else if ((livingNeighbors === self.livesOnTwo) || (livingNeighbors === self.livesOnThree)) {
                    currCell.cellObject.nextState = StatesOfLife.ALIVE;
                }

            } else {

                //Resurrection by use of the dark arts
                if (livingNeighbors === self.resurrectionThreshold) {
                    currCell.cellObject.nextState = StatesOfLife.ALIVE;
                }
            }
        });
    });

    this.updateGeneration();
};

/**
 * Gets a single cell's neighbors to see if they're dead or not.
 * @param x
 *      The X Coordinate of the cell
 * @param y
 *      The Y Coordinate of the cell
 * @returns {Array}
 *      An array of any cell's neighbors.
 */
GameOfLife.prototype.getNeighbors = function (x, y) {

    /*
    *    "Private" method to get the eight possible neighbor locations for any given cell.
    *    @return {Array}
    *           Returns an array containing all of the neighbor positions or any cell.
    */
    function getAllPossibleNeighbors() {

        var top = {
            xCoordinate: x,
            yCoordinate: y + 1
        };
        var left = {
            xCoordinate: x - 1,
            yCoordinate: y
        };
        var bottom = {
            xCoordinate: x,
            yCoordinate: y - 1
        };
        var right = {
            xCoordinate: x + 1,
            yCoordinate: y
        };

        var bottomLeft = {
            xCoordinate: x - 1,
            yCoordinate: y - 1
        };
        var topLeft = {
            xCoordinate: x - 1,
            yCoordinate: y + 1
        };
        var bottomRight = {
            xCoordinate: x + 1,
            yCoordinate: y - 1
        };
        var topRight = {
            xCoordinate: x + 1,
            yCoordinate: y + 1
        };

        return [
            top, left, bottom, right, bottomLeft, topLeft, bottomRight, topRight
        ];
    }

    var realNeighbors = [];
    var localBoard = this.currBoard;
    var allNeighborPositions = getAllPossibleNeighbors();

    /*
     * Verifies if neighbor exists in the 2D matrix.
     * @param potentialNeighbor
     *      The potential neighbor location in question
     * @returns {Array}
     *      Returns an array of the valid neighbors of the cell
     */
    function verifyIfNeighborExists(potentialNeighbor) {
        if (localBoard[potentialNeighbor.yCoordinate] &&
            localBoard[potentialNeighbor.yCoordinate][potentialNeighbor.xCoordinate]) {
            realNeighbors.push(localBoard[potentialNeighbor.yCoordinate][potentialNeighbor.xCoordinate]);
        }
    }

    allNeighborPositions.forEach(verifyIfNeighborExists);
    return realNeighbors;
};

/**
 * Updates the game one generation
 */
GameOfLife.prototype.updateGeneration = function () {
    var self = this;
    this.keepWorking = false;
    var newPopulation = 0;

    this.currBoard.forEach(function (currRow) {
        currRow.forEach(function (currCell) {

            if (currCell.cellObject.nextState !== currCell.cellObject.getProofOfLife() || !self.currGeneration) {
                self.keepWorking = true;
            }
            if (currCell.cellObject.nextState === StatesOfLife.ALIVE) {
                newPopulation++;
            }
            currCell.cellObject.setMortality(currCell.cellObject.nextState);
        });
    });

    this.generationText.text(this.currGeneration);
    this.currGeneration++;

    this.updatePopulation(newPopulation);
};

/**
 * Updates a single cell after a click
 * @param id
 *      The ID of the cell i.e. x10y10
 * @param value
 *      The new value for the cell, 1 = alive, 0 = dead.
 */
GameOfLife.prototype.updateSingleCell = function (id, value) {

    var coordinates = id.match(/\d+/g);
    var yCoordinate = parseInt(coordinates.pop());
    var xCoordinate = parseInt(coordinates.pop());
    var localBoard = this.currBoard;

    localBoard.forEach(function (row, yIndex) {
        row.forEach(function (cell, xIndex) {

            if (yIndex === yCoordinate && xIndex === xCoordinate) {
                cell.cellObject.setMortality(value);
            }
        });
    });

    var newPopulation = this.population;
    if (value === StatesOfLife.ALIVE) {
        newPopulation++;
    } else if (value === StatesOfLife.DEAD) {
        newPopulation--;
    }

    this.updatePopulation(newPopulation);
};

/**
 * Resets the population and generation when game is reset.
 */
GameOfLife.prototype.resetGeneration = function () {
    this.currGeneration = 0;
    this.generationText.text(this.currGeneration);
};