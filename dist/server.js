"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const path = require("path");
const server = require("http").Server(app);
const { Server } = require("socket.io");
const io = new Server(server);
const gameLogic_1 = require("./gameLogic");
const errors_1 = require("./errors");
const checkVictory_1 = require("./checkVictory");
const port = 8080;
const activeGames = {};
if (process.env.NODE_ENV == "production") {
    app.use((req, res, next) => {
        if (typeof req.headers["x-forwarded-proto"] == "string" &&
            req.headers["x-forwarded-proto"].startsWith("https")) {
            return next();
        }
        res.redirect(`https://${req.hostname}${req.url}`);
    });
}
app.use(express_1.default.static(path.resolve(__dirname, "../build")));
app.get("/*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "/index.html"));
});
io.on("connection", (socket) => {
    // console.log("a user connected: socket-id:", socket.id);
    // Start a new game
    socket.on("new-game", () => {
        let gameCode = (0, gameLogic_1.createNewGame)(activeGames, socket.id);
        socket.join(gameCode);
        io.in(gameCode).emit("game-update", activeGames[gameCode], gameCode);
    });
    // Check and set user game config
    socket.on("config-ready", (config, code) => {
        if ((0, gameLogic_1.doesGameExist)(activeGames, code)) {
            (0, gameLogic_1.validateUserConfig)(config, activeGames[code]);
            (0, gameLogic_1.startGameIfReady)(activeGames[code]);
            io.in(code).emit("game-update", activeGames[code]);
        }
        else {
            io.to(socket.id).emit("error", (0, errors_1.createErrorMessage)(4));
        }
    });
    // Check code and add second player to game (if game exists)
    socket.on("join-game", (code) => {
        if ((0, gameLogic_1.doesGameExist)(activeGames, code)) {
            activeGames[code].sockets[1] = socket.id;
            socket.join(code);
            (0, gameLogic_1.startGameIfReady)(activeGames[code]);
            io.in(code).emit("game-update", activeGames[code], code);
        }
        else {
            io.to(socket.id).emit("error", (0, errors_1.createErrorMessage)(1));
        }
    });
    // Handle click on column to add slot - check if the game exists, check if move is valid, if yes, add it to game board
    socket.on("column-click", (column, player, code) => {
        if ((0, gameLogic_1.doesGameExist)(activeGames, code)) {
            if ((0, gameLogic_1.checkValidMove)(activeGames[code], column, player)) {
                activeGames[code].lastMove = [
                    column,
                    activeGames[code].gameBoard[column].indexOf(null),
                    player,
                ];
                activeGames[code].playerTurn = null;
                io.in(code).emit("game-update", activeGames[code], code);
                setTimeout(() => {
                    (0, gameLogic_1.addLastMoveToGameBoard)(activeGames[code]);
                    if ((0, checkVictory_1.checkForVictory)(activeGames[code])) {
                        (0, gameLogic_1.setWinningState)(activeGames[code]);
                    }
                    else {
                        if ((0, gameLogic_1.checkForDraw)(activeGames[code])) {
                            (0, gameLogic_1.setDrawState)(activeGames[code]);
                        }
                        else {
                            (0, gameLogic_1.togglePlayerTurn)(activeGames[code]);
                        }
                    }
                    activeGames[code].lastMove = null;
                    io.in(code).emit("game-update", activeGames[code], code);
                }, 1500);
            }
            else {
                io.to(socket.id).emit("error", (0, errors_1.createErrorMessage)(3));
            }
        }
        else {
            io.to(socket.id).emit("error", (0, errors_1.createErrorMessage)(4));
        }
    });
    // If one player clicks "play again", mark playAgain true for them, and check if the other player also clicked play again. If yes, prepare the game for restart. Emit new gamestate either way.
    socket.on("play-again", (code, config) => {
        if ((0, gameLogic_1.doesGameExist)(activeGames, code)) {
            (0, gameLogic_1.setPlayAgain)(activeGames[code], socket.id, config);
            if ((0, gameLogic_1.checkIfBothWantToPlayAgain)(activeGames[code])) {
                (0, gameLogic_1.prepareRestartGame)(activeGames[code]);
            }
            io.in(code).emit("game-update", activeGames[code]);
        }
        else {
            io.to(socket.id).emit("error", (0, errors_1.createErrorMessage)(4));
        }
    });
    socket.on("leave-game", () => {
        // Delete the disconnecting socket from existing games & if there is still another player in that game, give back the code of that game
        let leftOverPlayer = (0, gameLogic_1.deleteSocketfromActiveGames)(socket.id, activeGames);
        // If there was a player left, send appropriate game update to the room with the game set to "closed"
        if (leftOverPlayer[0]) {
            // io.in(leftOverPlayer[1]).emit("error", createErrorMessage(2));
            io.in(leftOverPlayer[1]).emit("game-update", activeGames[leftOverPlayer[1]]);
        }
    });
    socket.on("disconnect", () => {
        // Delete the disconnecting socket from existing games & if there is still another player in that game, give back the code of that game
        let leftOverPlayer = (0, gameLogic_1.deleteSocketfromActiveGames)(socket.id, activeGames);
        // If there was a player left, send appropriate game update to the room with the game set to "closed"
        if (leftOverPlayer[0]) {
            // io.in(leftOverPlayer[1]).emit("error", createErrorMessage(2));
            io.in(leftOverPlayer[1]).emit("game-update", activeGames[leftOverPlayer[1]]);
        }
    });
});
if (process.env.NODE_ENV !== "test") {
    server.listen(process.env.PORT || port, function () {
        console.log("I'm listening.");
    });
}
//# sourceMappingURL=server.js.map