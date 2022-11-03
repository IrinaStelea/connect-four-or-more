import { describe, expect, test } from "@jest/globals";
import {
    addLastMoveToGameBoard,
    checkForDraw,
    checkForExistingGame,
    checkIfCorrectPlayer,
    checkIfEmptySlotLeftInColoumn,
    checkUserConfigForInteger,
    checkUserConfigValues,
    createNewGame,
    deleteSocketfromActiveGames,
    isRandomStringUnique,
    newGameObject,
    setWinningState,
    startGameIfReady,
    togglePlayerTurn,
    validateUserConfig,
} from "../src/gameLogic";
import { ActiveGames, GameObject } from "../src/types";

// createNewGame
describe("createNewGame", () => {
    test("creates a random 6 letter uppercase string and tests wether it's unique", () => {
        expect(createNewGame({}, "abcde")).toMatch(/[A-Z]+/);
        expect(createNewGame({}, "abcde")).toHaveLength(6);
    });
});

// isRandomStringUnique
describe("isRandomStringUnique", () => {
    test("checks wether a given string is unique in the activeGames Object", () => {
        expect(
            isRandomStringUnique("ABCDEF", {
                ABCDEF: {
                    gameBoard: null,
                    // playerName?: [string, string],
                    playerTurn: null,
                    score: [0, 0],
                    gameState: "config",
                    winner: null,
                    config: [7, 6, 4],
                    sockets: [null, null],
                    lastMove: null,
                    winningSlots: null,
                },
                XYZABE: {
                    gameBoard: null,
                    // playerName?: [string, string],
                    playerTurn: null,
                    score: [0, 0],
                    gameState: "config",
                    winner: null,
                    config: [7, 6, 4],
                    sockets: [null, null],
                    lastMove: null,
                    winningSlots: null,
                },
            })
        ).toBe(false);
    });
});

describe("newGameObject", () => {
    test("creates a new gameOBject in the actiGames with the passed in socketId as sockets[0] ", () => {
        expect(newGameObject("abcde")).toStrictEqual({
            gameBoard: null,
            // playerName?: [string, string],
            playerTurn: null,
            score: [0, 0],
            gameState: "config",
            winner: null,
            config: [7, 6, 4],
            sockets: ["abcde", null],
            lastMove: null,
            winningSlots: null,
        });
    });
});

describe("checkUserConfigForInteger", () => {
    test("checks wether the user config contains only integers and returns true if yes, false if no", () => {
        expect(checkUserConfigForInteger([1, 2, 4])).toBeTruthy();
        expect(checkUserConfigForInteger([1, 2, 1.5])).toBeFalsy();
    });
});

describe("checkUserConfigValue", () => {
    test("returns true, if config[0] is between 7 and 11, config[1] is between 6 and 11 and config[2] is between 4 and 6", () => {
        expect(checkUserConfigValues([1, 6, 4])).toBeFalsy();
        expect(checkUserConfigValues([7, 5, 4])).toBeFalsy();
        expect(checkUserConfigValues([7, 6, 3])).toBeFalsy();
        expect(checkUserConfigValues([12, 11, 6])).toBeFalsy();
        expect(checkUserConfigValues([11, 12, 6])).toBeFalsy();
        expect(checkUserConfigValues([11, 11, 7])).toBeFalsy();
        expect(checkUserConfigValues([7, 6, 4])).toBeTruthy();
    });
});

describe("checkForExistingGame", () => {
    test("if requested game exists, returns true", () => {
        expect(
            checkForExistingGame(
                {
                    ABCDEF: {
                        gameBoard: null,
                        // playerName?: [string, string],
                        playerTurn: null,
                        score: [0, 0],
                        gameState: "config",
                        winner: null,
                        config: [7, 6, 4],
                        sockets: [null, null],
                        lastMove: null,
                        winningSlots: null,
                    },
                    XYZABE: {
                        gameBoard: null,
                        // playerName?: [string, string],
                        playerTurn: null,
                        score: [0, 0],
                        gameState: "config",
                        winner: null,
                        config: [7, 6, 4],
                        sockets: [null, null],
                        lastMove: null,
                        winningSlots: null,
                    },
                },
                "ABCDEF"
            )
        ).toBeTruthy();
        expect(
            checkForExistingGame(
                {
                    ABCDEF: {
                        gameBoard: null,
                        // playerName?: [string, string],
                        playerTurn: null,
                        score: [0, 0],
                        gameState: "config",
                        winner: null,
                        config: [7, 6, 4],
                        sockets: [null, null],
                        lastMove: null,
                        winningSlots: null,
                    },
                    XYZABE: {
                        gameBoard: null,
                        // playerName?: [string, string],
                        playerTurn: null,
                        score: [0, 0],
                        gameState: "config",
                        winner: null,
                        config: [7, 6, 4],
                        sockets: [null, null],
                        lastMove: null,
                        winningSlots: null,
                    },
                },
                "ABASEF"
            )
        ).toBeFalsy();
    });
});

describe("deleteSocketfromActiveGames", () => {
    test("", () => {
        let activeGames: ActiveGames = {
            ABCDEF: {
                gameBoard: null,
                // playerName?: [string, string],
                playerTurn: null,
                score: [0, 0],
                gameState: "config",
                winner: null,
                config: [7, 6, 4],
                sockets: ["abcde", null],
                lastMove: null,
                winningSlots: null,
            },
            XYZABE: {
                gameBoard: null,
                // playerName?: [string, string],
                playerTurn: null,
                score: [0, 0],
                gameState: "config",
                winner: null,
                config: [7, 6, 4],
                sockets: ["hallo", "uvwxyz"],
                lastMove: null,
                winningSlots: null,
            },
        };
        expect(deleteSocketfromActiveGames("abcde", activeGames)).toEqual([
            false,
        ]);
        expect(activeGames).toEqual({
            XYZABE: {
                gameBoard: null,
                // playerName?: [string, string],
                playerTurn: null,
                score: [0, 0],
                gameState: "config",
                winner: null,
                config: [7, 6, 4],
                sockets: ["hallo", "uvwxyz"],
                lastMove: null,
                winningSlots: null,
            },
        });
        expect(deleteSocketfromActiveGames("uvwxyz", activeGames)).toEqual([
            true,
            "XYZABE",
        ]);
        expect(activeGames).toEqual({
            XYZABE: {
                gameBoard: null,
                // playerName?: [string, string],
                playerTurn: null,
                score: [0, 0],
                gameState: "closed",
                winner: null,
                config: [7, 6, 4],
                sockets: ["hallo", null],
                lastMove: null,
                winningSlots: null,
            },
        });
        expect(deleteSocketfromActiveGames("hallo", activeGames)).toEqual([
            false,
        ]);
        expect(activeGames).toEqual({});
    });
});

describe("startGameIfReady", () => {
    test("checks wether the the condition for a game to start have been met and if so changes gameState to running", () => {
        let gameObject: GameObject = {

                gameBoard: null,
                // playerName?: [string, string],
                playerTurn: null,
                score: [0, 0],
                gameState: "ready",
                winner: null,
                config: [2, 3, 4],
                sockets: ["hallo", "sdfsdf"],
                lastMove: null,
                winningSlots: null,
            };

        startGameIfReady(gameObject);
        expect(gameObject.gameState).toBe("running");
        expect([1, 2]).toContain(gameObject.playerTurn);
        expect(gameObject.gameBoard).toEqual([
            [null, null, null],
            [null, null, null],
        ]);
    });
});

describe("checkIfCorrectPlayer", () => {
    test("checks wether the player whose turn it is made the move and returns true/false", () => {
        let gameObject: GameObject = {
                gameBoard: null,
                // playerName?: [string, string],
                playerTurn: 2,
                score: [0, 0],
                gameState: "ready",
                winner: null,
                config: [2, 3, 4],
                sockets: ["hallo", "sdfsdf"],
                lastMove: null,
                winningSlots: null,

        };
        expect(checkIfCorrectPlayer(gameObject, 2)).toBeTruthy();
        expect(checkIfCorrectPlayer(gameObject, 1)).toBeFalsy();
        expect(checkIfCorrectPlayer(gameObject, null)).toBeFalsy();
    });
});

describe("checkIfEmptySlotLeftInColoumn", () => {
    test("checks wether there is at least one empty slot left in the chosen coloumn and returns true/false", () => {
        let gameObject:GameObject = {
                gameBoard: [
                    [null, null, null],
                    [2, 1, null],
                    [1, 2, 2],
                ],
                // playerName?: [string, string],
                playerTurn: 2,
                score: [0, 0],
                gameState: "ready",
                winner: null,
                config: [2, 3, 4],
                sockets: ["hallo", "sdfsdf"],
                lastMove: null,
                winningSlots: null,

        };
        expect(
            checkIfEmptySlotLeftInColoumn(gameObject, 0)
        ).toBeTruthy();
        expect(
            checkIfEmptySlotLeftInColoumn(gameObject, 1)
        ).toBeTruthy();
        expect(
            checkIfEmptySlotLeftInColoumn(gameObject, 2)
        ).toBeFalsy();
    });
});

describe("addLastMoveToGameBoard", () => {
    test("adds the lastMove to the gameBoard, doesn't return anything", () => {
        let gameObject: GameObject = {
                gameBoard: [
                    [null, null, null],
                    [2, 1, null],
                    [1, 2, 2],
                ],
                // playerName?: [string, string],
                playerTurn: 2,
                score: [0, 0],
                gameState: "ready",
                winner: null,
                config: [2, 3, 4],
                sockets: ["hallo", "sdfsdf"],
                lastMove: [1, 2, 2],
                winningSlots: null,
        };
        addLastMoveToGameBoard(gameObject);
        expect(gameObject.gameBoard[1][2]).toBe(2);
        gameObject = {
                gameBoard: [
                    [null, null, null],
                    [2, 1, 1],
                    [1, 2, 2],
                ],
                // playerName?: [string, string],
                playerTurn: 2,
                score: [0, 0],
                gameState: "ready",
                winner: null,
                config: [2, 3, 4],
                sockets: ["hallo", "sdfsdf"],
                lastMove: [0, 0, 2],
                winningSlots: null,

        };
        addLastMoveToGameBoard(gameObject);
        expect(gameObject.gameBoard[0][0]).toBe(2);
    });
});

describe("checkIfCorrectPlayer", () => {
    test("checks wether the player whose turn it is made the move and returns true/false", () => {
        let gameObject: GameObject = {
                gameBoard: null,
                // playerName?: [string, string],
                playerTurn: 2,
                score: [0, 0],
                gameState: "running",
                winner: null,
                config: [2, 3, 4],
                sockets: ["hallo", "sdfsdf"],
                lastMove: [1, 1, 2],
                winningSlots: null,
        };
        setWinningState(gameObject);
        expect(gameObject.gameState).toBe("end");
        expect(gameObject.winner).toBe(2);
        expect(gameObject.score[1]).toBe(1);
    });
});

describe("togglePlayerTurn", () => {
    test("changes the playerTurn from 1 to 2 and the other way around, no return", () => {
        let gameObject: GameObject = {
                gameBoard: null,
                // playerName?: [string, string],
                playerTurn: null,
                score: [0, 0],
                gameState: "running",
                winner: null,
                config: [2, 3, 4],
                sockets: ["hallo", "sdfsdf"],
                lastMove: [1, 1, 2],
                winningSlots: null,

        };
        togglePlayerTurn(gameObject);
        expect(gameObject.playerTurn).toBe(1);
        gameObject = {
                gameBoard: null,
                // playerName?: [string, string],
                playerTurn: null,
                score: [0, 0],
                gameState: "running",
                winner: null,
                config: [2, 3, 4],
                sockets: ["hallo", "sdfsdf"],
                lastMove: [1, 1, 1],
                winningSlots: null,
        };
        togglePlayerTurn(gameObject);
        expect(gameObject.playerTurn).toBe(2);
    });
});

describe("checkForDraw", () => {
    test("returns true, if draw, false if not", () => {
        let gameObject: GameObject = {
                gameBoard: [
                    [1, 2, 2],
                    [1, 2, 2],
                    [1, 2, 2],
                ],
                // playerName?: [string, string],
                playerTurn: null,
                score: [0, 0],
                gameState: "running",
                winner: null,
                config: [2, 3, 4],
                sockets: ["hallo", "sdfsdf"],
                lastMove: [1, 1, 1],
                winningSlots: null,

        };
        expect(checkForDraw(gameObject)).toBeTruthy();
        gameObject = {
                gameBoard: [
                    [1, 2, null],
                    [1, 2, 2],
                    [1, 2, 2],
                ],
                // playerName?: [string, string],
                playerTurn: null,
                score: [0, 0],
                gameState: "running",
                winner: null,
                config: [2, 3, 4],
                sockets: ["hallo", "sdfsdf"],
                lastMove: [1, 1, 1],
                winningSlots: null,

        };
        expect(checkForDraw(gameObject)).toBeFalsy();
    });
});