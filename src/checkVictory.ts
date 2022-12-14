import { Player, GameObject } from "./types";

function getVerticalSet(gameObject: GameObject): number[][] {
    let colIdx: number = gameObject.lastMove[0];
    let rowIdx: number = gameObject.lastMove[1];
    return gameObject.gameBoard[colIdx]
        .slice(0, rowIdx + 1)
        .map((e: number, idx: number) => [colIdx, idx, e]);
}

function getHorizontalSet(gameObject: GameObject): number[][] {
    let rowIdx: number = gameObject.lastMove[1];
    return gameObject.gameBoard.map((e: number[], idx: number) =>
        [idx, rowIdx, e.slice(rowIdx, rowIdx + 1)].flat()
    );
}

function getBackDiagonal(gameObject: GameObject): number[][] {
    let colIdx: number = gameObject.lastMove[0];
    let rowIdx: number = gameObject.lastMove[1];
    let colCount: number = gameObject.config[0];
    let rowCount: number = gameObject.config[1];
    let diagBack: number[][] = [];

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

function getFwdDiagonal(gameObject: GameObject): number[][] {
    let colIdx: number = gameObject.lastMove[0];
    let rowIdx: number = gameObject.lastMove[1];
    let colCount: number = gameObject.config[0];
    let rowCount: number = gameObject.config[1];

    let diagFwd: number[][] = [];
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

function checkNbWinningSlots(set: number[][], gameObject: GameObject): boolean {
    let winningNumber: number = gameObject.config[2];
    let playerTurn: Player = gameObject.lastMove[2];

    if (set.length < winningNumber) {
        return false;
    }

    let count: number = 0;
    let winningSlots: [number, number][] | null = [];

    for (let i: number = 0; i < set.length; i++) {
        if (set[i][2] == playerTurn) {
            count++;
            winningSlots.push([set[i][0], set[i][1]]);
        } else {
            //check for win - also accounts for cases where there are more slots than the required winning slots
            if (count >= winningNumber) {
                gameObject.winningSlots = gameObject.winningSlots
                    ? [...gameObject.winningSlots, ...winningSlots]
                    : winningSlots;
                return true;
            } else {
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

export function checkForVictory(gameObject: GameObject): boolean {
    let victory: boolean = false;
    let verticalVictory: boolean = checkNbWinningSlots(
        getVerticalSet(gameObject),
        gameObject
    );

    let horizontalVictory: boolean = checkNbWinningSlots(
        getHorizontalSet(gameObject),
        gameObject
    );

    let diagBackVictory: boolean = checkNbWinningSlots(
        getBackDiagonal(gameObject),
        gameObject
    );

    let diagFwdVictory: boolean = checkNbWinningSlots(
        getFwdDiagonal(gameObject),
        gameObject
    );

    let victoryArray: boolean[] = [
        verticalVictory,
        horizontalVictory,
        diagBackVictory,
        diagFwdVictory,
    ];

    if (victoryArray.some((e: boolean) => e === true)) {
        victory = true;
    }

    return victory;
}
