"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkForVictory = void 0;
function getVerticalSet(gameObject) {
    let colIdx = gameObject.lastMove[0];
    let rowIdx = gameObject.lastMove[1];
    return gameObject.gameBoard[colIdx]
        .slice(0, rowIdx + 1)
        .map((e, idx) => [colIdx, idx, e]);
}
function getHorizontalSet(gameObject) {
    let rowIdx = gameObject.lastMove[1];
    return gameObject.gameBoard.map((e, idx) => [idx, rowIdx, e.slice(rowIdx, rowIdx + 1)].flat());
}
function getBackDiagonal(gameObject) {
    let colIdx = gameObject.lastMove[0];
    let rowIdx = gameObject.lastMove[1];
    let colCount = gameObject.config[0];
    let rowCount = gameObject.config[1];
    let diagBack = [];
    //find starting slot and add to diagonal array
    while (colIdx > 0 && rowIdx < rowCount - 1) {
        colIdx -= 1;
        rowIdx += 1;
    }
    diagBack.push([colIdx, rowIdx, gameObject.gameBoard[colIdx][rowIdx]]);
    //add the other slots
    while (colIdx < colCount - 1 && rowIdx > 0) {
        colIdx += 1;
        rowIdx -= 1;
        diagBack.push([colIdx, rowIdx, gameObject.gameBoard[colIdx][rowIdx]]);
    }
    return diagBack;
}
function getFwdDiagonal(gameObject) {
    let colIdx = gameObject.lastMove[0];
    let rowIdx = gameObject.lastMove[1];
    let colCount = gameObject.config[0];
    let rowCount = gameObject.config[1];
    let diagFwd = [];
    //find starting slot and add to diagonal array
    while (colIdx > 0 && rowIdx > 0) {
        colIdx -= 1;
        rowIdx -= 1;
    }
    diagFwd.push([colIdx, rowIdx, gameObject.gameBoard[colIdx][rowIdx]]);
    //add the other slots
    while (colIdx < colCount - 1 && rowIdx < rowCount - 1) {
        colIdx += 1;
        rowIdx += 1;
        diagFwd.push([colIdx, rowIdx, gameObject.gameBoard[colIdx][rowIdx]]);
    }
    return diagFwd;
}
function checkNbWinningSlots(set, gameObject) {
    let winningNumber = gameObject.config[2];
    let playerTurn = gameObject.lastMove[2];
    if (set.length < winningNumber) {
        return false;
    }
    let count = 0;
    let winningSlots = [];
    for (let i = 0; i < set.length; i++) {
        if (set[i][2] == playerTurn) {
            count++;
            winningSlots.push([set[i][0], set[i][1]]);
        }
        else {
            //check for win - also accounts for cases where there are more slots than the required winning slots
            if (count >= winningNumber) {
                gameObject.winningSlots = gameObject.winningSlots
                    ? [...gameObject.winningSlots, ...winningSlots]
                    : winningSlots;
                return true;
            }
            else {
                count = 0;
                winningSlots = [];
            }
        }
        if (i === set.length - 1 && count >= winningNumber) {
            gameObject.winningSlots = gameObject.winningSlots
                ? [...gameObject.winningSlots, ...winningSlots]
                : winningSlots;
            return true;
        }
    }
    return false;
}
function checkForVictory(gameObject) {
    let victory = false;
    let verticalVictory = checkNbWinningSlots(getVerticalSet(gameObject), gameObject);
    let horizontalVictory = checkNbWinningSlots(getHorizontalSet(gameObject), gameObject);
    let diagBackVictory = checkNbWinningSlots(getBackDiagonal(gameObject), gameObject);
    let diagFwdVictory = checkNbWinningSlots(getFwdDiagonal(gameObject), gameObject);
    let victoryArray = [
        verticalVictory,
        horizontalVictory,
        diagBackVictory,
        diagFwdVictory,
    ];
    if (victoryArray.some((e) => e === true)) {
        victory = true;
    }
    return victory;
}
exports.checkForVictory = checkForVictory;
//# sourceMappingURL=checkVictory.js.map