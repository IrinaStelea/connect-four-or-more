import { ActiveGames, GameObject, Player } from "./types";

// Set a code for a new game
export function createNewGame(
    activeGames: ActiveGames,
    socketId: string
): string {
    let tempRandomString: string = generateRandomString(6);
    if (isRandomStringUnique(tempRandomString, activeGames)) {
        activeGames[tempRandomString] = newGameObject(socketId);
    } else {
        createNewGame(activeGames, socketId);
    }
    return tempRandomString;
}

// Generate a random 6 letter uppercase string
export const generateRandomString = (myLength: number) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const randomArray = Array.from(
        { length: myLength },
        (v, k) => chars[Math.floor(Math.random() * chars.length)]
    );
    const randomString = randomArray.join("");
    return randomString;
};

// Check if tempRandomString is already in use
export function isRandomStringUnique(
    tempRandomString: string,
    activeGames: ActiveGames
): boolean {
    // If activeGames has the created key, return false
    if (tempRandomString in activeGames) {
        return false;
    }
    // Otherwise return true
    return true;
}

// Create new gameObject
export function newGameObject(socketId: string): GameObject {
    return {
        gameBoard: null,
        // playerName?: [string, string],
        playerTurn: null,
        score: [0, 0],
        gameState: "config",
        winner: null,
        config: [7, 6, 4],
        sockets: [socketId, null],
        lastMove: null,
        winningSlots: null,
        playAgain: [false, false],
        playerStartedLast: null,
    };
}

// Check if requested game exists
export function doesGameExist(
    activeGames: ActiveGames,
    gameCode: string
): boolean {
    return Object.keys(activeGames).includes(gameCode);
}

// Validate user config (if invalid, provide default config); set gameState to ready
export function validateUserConfig(
    config: [number, number, number],
    gameObject: GameObject
): void {
    if (checkUserConfigForInteger(config) && checkUserConfigValues(config)) {
        gameObject.config = config;
    } else {
        gameObject.config = [7, 6, 4];
    }
    gameObject.gameState = "ready";
}

// Check if user config contains integers
export function checkUserConfigForInteger(
    config: [number, number, number]
): boolean {
    return config.every((item) => {
        return Number.isInteger(item);
    });
}

// Check if user config values fits withing provided range
export function checkUserConfigValues(
    config: [number, number, number]
): boolean {
    if (config[0] > 6 && config[0] < 12) {
        if (config[1] > 5 && config[1] < 12) {
            if (config[2] > 3 && config[2] < 7) {
                return true;
            }
        }
    }
    return false;
}

// Check if all criteria are met for the game to start; if yes, change gameState to running
export function startGameIfReady(gameObject: GameObject): void {
    if (
        gameObject.gameState === "ready" &&
        typeof gameObject.sockets[0] === "string" &&
        typeof gameObject.sockets[1] === "string"
    ) {
        gameObject.gameBoard = [];
        for (let i: number = 0; i < gameObject.config[0]; i++) {
            gameObject.gameBoard[i] = new Array(gameObject.config[1]).fill(
                null
            );
        }
        let startingPlayer: 1 | 2 = randomPlayerTurn();
        gameObject.playerTurn = startingPlayer;
        gameObject.playerStartedLast = startingPlayer;
        gameObject.gameState = "running";
    }
}

// Randomize initial playerTurn
export function randomPlayerTurn(): 1 | 2 {
    let tempNum: number = Math.floor(Math.random() * 2) + 1;
    if (tempNum === 1 || tempNum === 2) {
        return tempNum;
    }
}

// Check validity of player move
export function checkValidMove(
    gameObject: GameObject,
    coloumn: number,
    player: 1 | 2
): boolean {
    if (
        checkIfCorrectPlayer(gameObject, player) &&
        checkIfEmptySlotLeftInColoumn(gameObject, coloumn)
    ) {
        return true;
    }
    return false;
}

// Check if the correct player made the move
export function checkIfCorrectPlayer(
    gameObject: GameObject,
    player: 1 | 2
): boolean {
    if (gameObject.playerTurn === player) {
        return true;
    }
    return false;
}

// Check if there is at least one slot left in the column
export function checkIfEmptySlotLeftInColoumn(
    gameObject: GameObject,
    coloumn: number
): boolean {
    if (gameObject.gameBoard[coloumn].includes(null)) {
        return true;
    }
    return false;
}

// Add lastMove to gameBoard
export function addLastMoveToGameBoard(gameObject: GameObject): void {
    let lastMove: [number, number, Player] = gameObject.lastMove;
    gameObject.gameBoard[lastMove[0]][lastMove[1]] = lastMove[2];
    // gameObject.lastMove = null;
}

// Set gameObject to reflect win state
export function setWinningState(gameObject: GameObject) {
    gameObject.gameState = "end";
    gameObject.winner = gameObject.lastMove[2];
    gameObject.score[gameObject.lastMove[2] - 1]++;
}

// Set gameObject to reflect draw state
export function setDrawState(gameObject: GameObject) {
    gameObject.gameState = "end";
    gameObject.winner = null;
}

// Toggle playerTurn to next player for multiple games with the same players
export function togglePlayerTurn(gameObject: GameObject) {
    if (gameObject.lastMove[2] === 1) {
        gameObject.playerTurn = 2;
    } else if (gameObject.lastMove[2] === 2) {
        gameObject.playerTurn = 1;
    }
}

// Check whether the gameBoard is full - returns true or false
export function checkForDraw(gameObject: GameObject): boolean {
    let draw: boolean = false;
    for (let i = 0; i < gameObject.config[0]; i++) {
        if (!gameObject.gameBoard[i].some((item) => item === null)) {
            draw = true;
        }
        return draw;
    }
}

// Set the playAgain flag for a player to true; function doesn't return anything
export function setPlayAgain(
    gameObject: GameObject,
    socketId: string,
    config: [number, number, number] = null
) {
    let player: number = gameObject.sockets.indexOf(socketId);

    if (player === 0 && config) {
        if (
            checkUserConfigForInteger(config) &&
            checkUserConfigValues(config)
        ) {
            gameObject.config = config;
        }
    }
    gameObject.playAgain[player] = true;
}

// If both playAgain flags are true, return true, otherwise return false
export function checkIfBothWantToPlayAgain(gameObject: GameObject) {
    if (gameObject.playAgain[0] && gameObject.playAgain[1]) {
        return true;
    }
    return false;
}

// Reset the gameObject to restart with same players and same config; switch initial player turn to the opposite of last round.
export function prepareRestartGame(gameObject: GameObject) {
    for (let i: number = 0; i < gameObject.config[0]; i++) {
        gameObject.gameBoard[i] = new Array(gameObject.config[1]).fill(null);
    }
    let playerStart: 1 | 2 = gameObject.playerStartedLast == 1 ? 2 : 1;
    gameObject.playerTurn = playerStart;
    gameObject.playerStartedLast = playerStart;
    gameObject.winner = null;
    gameObject.lastMove = null;
    gameObject.winningSlots = null;
    gameObject.playAgain = [false, false];
    gameObject.gameState = "running";
}

// On user disconnect, delete the socket from active games
export function deleteSocketfromActiveGames(
    socketId,
    activeGames: ActiveGames
): [boolean, string?] {
    // set up a variable to receive the code of the game in case there is a leftover player
    let isSecondPlayerLeft: boolean | string = false;
    // Go through all games and look for the socket.id that disconnected
    Object.entries(activeGames).map((item) => {
        if (socketId === item[1].sockets[0]) {
            item[1].sockets[0] = null;
            // Check if there is still another player in that game
            isSecondPlayerLeft = checkIfSecondPlayerStillThere(
                activeGames,
                item[0],
                1
            );
        }
        if (socketId === item[1].sockets[1]) {
            item[1].sockets[1] = null;
            // Check if there is still another player in that game
            isSecondPlayerLeft = checkIfSecondPlayerStillThere(
                activeGames,
                item[0],
                0
            );
        }
    });
    // If a player is left, return the code of their game
    if (isSecondPlayerLeft) {
        return [true, isSecondPlayerLeft];
    } else {
        return [false];
    }
}

// Check if the other player is left in the room when one socket disconnects
export function checkIfSecondPlayerStillThere(
    activeGames: ActiveGames,
    gameCode: string,
    socketSlot: 0 | 1
): boolean | string {
    // If not, then delete that game from the activeGames and return false
    if (activeGames[gameCode].sockets[socketSlot] === null) {
        delete activeGames[gameCode];
        return false;
        //  If yes, then set gameState to "closed", make playerTurn null and return the code of that game
    } else {
        activeGames[gameCode].gameState = "closed";
        activeGames[gameCode].playerTurn = null;
        return gameCode;
    }
}
