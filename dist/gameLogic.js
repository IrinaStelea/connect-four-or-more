"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIfSecondPlayerStillThere = exports.deleteSocketfromActiveGames = exports.prepareRestartGame = exports.checkIfBothWantToPlayAgain = exports.setPlayAgain = exports.checkForDraw = exports.togglePlayerTurn = exports.setDrawState = exports.setWinningState = exports.addLastMoveToGameBoard = exports.checkIfEmptySlotLeftInColoumn = exports.checkIfCorrectPlayer = exports.checkValidMove = exports.randomPlayerTurn = exports.startGameIfReady = exports.checkUserConfigValues = exports.checkUserConfigForInteger = exports.validateUserConfig = exports.doesGameExist = exports.newGameObject = exports.isRandomStringUnique = exports.generateRandomString = exports.createNewGame = void 0;
// Set a code for a new game
function createNewGame(activeGames, socketId) {
    let tempRandomString = (0, exports.generateRandomString)(6);
    if (isRandomStringUnique(tempRandomString, activeGames)) {
        activeGames[tempRandomString] = newGameObject(socketId);
    }
    else {
        createNewGame(activeGames, socketId);
    }
    return tempRandomString;
}
exports.createNewGame = createNewGame;
// Generate a random 6 letter uppercase string
const generateRandomString = (myLength) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const randomArray = Array.from({ length: myLength }, (v, k) => chars[Math.floor(Math.random() * chars.length)]);
    const randomString = randomArray.join("");
    return randomString;
};
exports.generateRandomString = generateRandomString;
// Check if tempRandomString is already in use
function isRandomStringUnique(tempRandomString, activeGames) {
    // If activeGames has the created key, return false
    if (tempRandomString in activeGames) {
        return false;
    }
    // Otherwise return true
    return true;
}
exports.isRandomStringUnique = isRandomStringUnique;
// Create new gameObject
function newGameObject(socketId) {
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
exports.newGameObject = newGameObject;
// Check if requested game exists
function doesGameExist(activeGames, gameCode) {
    return Object.keys(activeGames).includes(gameCode);
}
exports.doesGameExist = doesGameExist;
// Validate user config (if invalid, provide default config); set gameState to ready
function validateUserConfig(config, gameObject) {
    if (checkUserConfigForInteger(config) && checkUserConfigValues(config)) {
        gameObject.config = config;
    }
    else {
        gameObject.config = [7, 6, 4];
    }
    gameObject.gameState = "ready";
}
exports.validateUserConfig = validateUserConfig;
// Check if user config contains integers
function checkUserConfigForInteger(config) {
    return config.every((item) => {
        return Number.isInteger(item);
    });
}
exports.checkUserConfigForInteger = checkUserConfigForInteger;
// Check if user config values fits withing provided range
function checkUserConfigValues(config) {
    if (config[0] > 6 && config[0] < 12) {
        if (config[1] > 5 && config[1] < 12) {
            if (config[2] > 3 && config[2] < 7) {
                return true;
            }
        }
    }
    return false;
}
exports.checkUserConfigValues = checkUserConfigValues;
// Check if all criteria are met for the game to start; if yes, change gameState to running
function startGameIfReady(gameObject) {
    if (gameObject.gameState === "ready" &&
        typeof gameObject.sockets[0] === "string" &&
        typeof gameObject.sockets[1] === "string") {
        gameObject.gameBoard = [];
        for (let i = 0; i < gameObject.config[0]; i++) {
            gameObject.gameBoard[i] = new Array(gameObject.config[1]).fill(null);
        }
        let startingPlayer = randomPlayerTurn();
        gameObject.playerTurn = startingPlayer;
        gameObject.playerStartedLast = startingPlayer;
        gameObject.gameState = "running";
    }
}
exports.startGameIfReady = startGameIfReady;
// Randomize initial playerTurn
function randomPlayerTurn() {
    let tempNum = Math.floor(Math.random() * 2) + 1;
    if (tempNum === 1 || tempNum === 2) {
        return tempNum;
    }
}
exports.randomPlayerTurn = randomPlayerTurn;
// Check validity of player move
function checkValidMove(gameObject, coloumn, player) {
    if (checkIfCorrectPlayer(gameObject, player) &&
        checkIfEmptySlotLeftInColoumn(gameObject, coloumn)) {
        return true;
    }
    return false;
}
exports.checkValidMove = checkValidMove;
// Check if the correct player made the move
function checkIfCorrectPlayer(gameObject, player) {
    if (gameObject.playerTurn === player) {
        return true;
    }
    return false;
}
exports.checkIfCorrectPlayer = checkIfCorrectPlayer;
// Check if there is at least one slot left in the column
function checkIfEmptySlotLeftInColoumn(gameObject, coloumn) {
    if (gameObject.gameBoard[coloumn].includes(null)) {
        return true;
    }
    return false;
}
exports.checkIfEmptySlotLeftInColoumn = checkIfEmptySlotLeftInColoumn;
// Add lastMove to gameBoard
function addLastMoveToGameBoard(gameObject) {
    let lastMove = gameObject.lastMove;
    gameObject.gameBoard[lastMove[0]][lastMove[1]] = lastMove[2];
    // gameObject.lastMove = null;
}
exports.addLastMoveToGameBoard = addLastMoveToGameBoard;
// Set gameObject to reflect win state
function setWinningState(gameObject) {
    gameObject.gameState = "end";
    gameObject.winner = gameObject.lastMove[2];
    gameObject.score[gameObject.lastMove[2] - 1]++;
}
exports.setWinningState = setWinningState;
// Set gameObject to reflect draw state
function setDrawState(gameObject) {
    gameObject.gameState = "end";
    gameObject.winner = null;
}
exports.setDrawState = setDrawState;
// Toggle playerTurn to next player for multiple games with the same players
function togglePlayerTurn(gameObject) {
    if (gameObject.lastMove[2] === 1) {
        gameObject.playerTurn = 2;
    }
    else if (gameObject.lastMove[2] === 2) {
        gameObject.playerTurn = 1;
    }
}
exports.togglePlayerTurn = togglePlayerTurn;
// Check whether the gameBoard is full - returns true or false
function checkForDraw(gameObject) {
    let draw = false;
    for (let i = 0; i < gameObject.config[0]; i++) {
        if (!gameObject.gameBoard[i].some((item) => item === null)) {
            draw = true;
        }
        return draw;
    }
}
exports.checkForDraw = checkForDraw;
// Set the playAgain flag for a player to true; function doesn't return anything
function setPlayAgain(gameObject, socketId, config = null) {
    let player = gameObject.sockets.indexOf(socketId);
    if (player === 0 && config) {
        if (checkUserConfigForInteger(config) &&
            checkUserConfigValues(config)) {
            gameObject.config = config;
        }
    }
    gameObject.playAgain[player] = true;
}
exports.setPlayAgain = setPlayAgain;
// If both playAgain flags are true, return true, otherwise return false
function checkIfBothWantToPlayAgain(gameObject) {
    if (gameObject.playAgain[0] && gameObject.playAgain[1]) {
        return true;
    }
    return false;
}
exports.checkIfBothWantToPlayAgain = checkIfBothWantToPlayAgain;
// Reset the gameObject to restart with same players and same config; switch initial player turn to the opposite of last round.
function prepareRestartGame(gameObject) {
    for (let i = 0; i < gameObject.config[0]; i++) {
        gameObject.gameBoard[i] = new Array(gameObject.config[1]).fill(null);
    }
    let playerStart = gameObject.playerStartedLast == 1 ? 2 : 1;
    gameObject.playerTurn = playerStart;
    gameObject.playerStartedLast = playerStart;
    gameObject.winner = null;
    gameObject.lastMove = null;
    gameObject.winningSlots = null;
    gameObject.playAgain = [false, false];
    gameObject.gameState = "running";
}
exports.prepareRestartGame = prepareRestartGame;
// On user disconnect, delete the socket from active games
function deleteSocketfromActiveGames(socketId, activeGames) {
    // set up a variable to receive the code of the game in case there is a leftover player
    let isSecondPlayerLeft = false;
    // Go through all games and look for the socket.id that disconnected
    Object.entries(activeGames).map((item) => {
        if (socketId === item[1].sockets[0]) {
            item[1].sockets[0] = null;
            // Check if there is still another player in that game
            isSecondPlayerLeft = checkIfSecondPlayerStillThere(activeGames, item[0], 1);
        }
        if (socketId === item[1].sockets[1]) {
            item[1].sockets[1] = null;
            // Check if there is still another player in that game
            isSecondPlayerLeft = checkIfSecondPlayerStillThere(activeGames, item[0], 0);
        }
    });
    // If a player is left, return the code of their game
    if (isSecondPlayerLeft) {
        return [true, isSecondPlayerLeft];
    }
    else {
        return [false];
    }
}
exports.deleteSocketfromActiveGames = deleteSocketfromActiveGames;
// Check if the other player is left in the room when one socket disconnects
function checkIfSecondPlayerStillThere(activeGames, gameCode, socketSlot) {
    // If not, then delete that game from the activeGames and return false
    if (activeGames[gameCode].sockets[socketSlot] === null) {
        delete activeGames[gameCode];
        return false;
        //  If yes, then set gameState to "closed", make playerTurn null and return the code of that game
    }
    else {
        activeGames[gameCode].gameState = "closed";
        activeGames[gameCode].playerTurn = null;
        return gameCode;
    }
}
exports.checkIfSecondPlayerStillThere = checkIfSecondPlayerStillThere;
//# sourceMappingURL=gameLogic.js.map