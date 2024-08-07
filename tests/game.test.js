import { SHIP_TYPES, getRandomInt, placeShipRandomly, randomlyPlaceShips, resetGameboard, randomizeShipPlacement, canPlaceShip, processAttack, switchPlayer} from "../src/game.js";
import { removeGridEventListener, addGridEventListener, updateDOM, finalUpdateDOM } from "../src/dom.js";
import * as gameModule from "../src/game.js";
import { Gameboard, Player } from "../src/battleship.js";

jest.mock('../src/dom.js');

describe("getRandomInt, placeShipRandomly, randomlyPlaceShips, resetGameboard, and randomizeShipPlacement functions", () => {
    let gameboard, player, gameboardOne, gameboardTwo, playerOne, playerTwo;

    beforeEach(() => {
        gameboard = new Gameboard(); 
        player = new Player('real');
        gameboardOne = new Gameboard();
        gameboardTwo = new Gameboard();
        playerOne = new Player('real');
        playerTwo = new Player('computer');
    });

    test('getRandomInt returns a value within the specified range', () => {
        for (let i = 0; i < 100; i++) {
            const value = getRandomInt(0, 10);
            expect(value).toBeGreaterThanOrEqual(0);
            expect(value).toBeLessThanOrEqual(10);
        }
    });

    test('placeShipRandomly places a ship on the gameboard', () => {
        const ship = { name: 'battleship', length: 4 };
        placeShipRandomly(gameboard, ship);
        const placedShip = gameboard.ships.find(s => s.name === "battleship");
        expect(placedShip).toBeDefined();
        expect(placedShip.coordinates.length).toBe(4);
    });

    test('randomlyPlaceShips places all ships on the player\'s gameboard', () => {
        randomlyPlaceShips(player);
        expect(player.gameboard.ships.length).toBe(SHIP_TYPES.length);
    });

    test('resetGameboard', () => {
        resetGameboard(gameboard);
        expect(gameboard.ships.length).toBe(0);
        gameboard.grid.forEach(row => {
            row.forEach(cell => {
                expect(cell.ship).toBeNull();
                expect(cell.cellAttacked).toBe(false);
            });
        });
    });

    test('randomizeShipPlacement for both gameboards', () => {
        randomizeShipPlacement(gameboardOne, gameboardTwo);
        expect(gameboardOne.ships.length).toBe(SHIP_TYPES.length);
        expect(gameboardTwo.ships.length).toBe(SHIP_TYPES.length);
    })
});

describe('canPlaceShip', () => {
    let gameboard;

    beforeEach(() => {
        gameboard = new Gameboard();
    });

    test('returns false if ship cannot be placed horizontally out of bounds', () => {
        expect(canPlaceShip(gameboard, 5, 6, 0, true)).toBe(false);
    });

    test('returns false if ship cannot be placed vertically out of bounds', () => {
        expect(canPlaceShip(gameboard, 5, 0, 6, false)).toBe(false);
    });

    test('returns true if ship can be placed horizontally within bounds', () => {
        expect(canPlaceShip(gameboard, 5, 0, 0, true)).toBe(true);
    });

    test('returns true f ship can be placed vertically within bounds', () => {
        expect(canPlaceShip(gameboard, 5, 0, 0, false)).toBe(true);
    });
})

describe('processAttack and switchPlayer functions', () => {
    let gameboard;
    let gameboardTwo;

    beforeEach(() => {
        gameboard = new Gameboard();
        gameboardTwo = new Gameboard();
        
        gameboard.receiveAttack = jest.fn(),
        gameboard.areAllShipsSunk = jest.fn(),
        gameboardTwo.receiveAttack = jest.fn(),
        gameboardTwo.areAllShipsSunk = jest.fn(),

        jest.clearAllMocks();
    });

    describe('processAttack function', () => {

        test('updates DOM and switches player on miss', () => {
            gameboard.receiveAttack.mockImplementation(({ x, y }) => 'miss');
            gameboard.areAllShipsSunk.mockReturnValue(false);

            processAttack(1, 1, gameboard);

            expect(gameboard.receiveAttack).toHaveBeenCalledWith({ x: 1, y: 1 });
            expect(updateDOM).toHaveBeenCalledWith(1, 1, 'miss', 'grid1');
            expect(gameboard.areAllShipsSunk).toHaveBeenCalled();
            expect(finalUpdateDOM).not.toHaveBeenCalledWith();
            expect(removeGridEventListener).not.toHaveBeenCalledWith();
        });

        test('updates DOM and ends game if all ships are sunk', () => {
            gameboard.receiveAttack.mockImplementation(({ x, y }) => 'hit');
            gameboard.areAllShipsSunk.mockReturnValue(true);

            processAttack(2, 2, gameboard);

            expect(gameboard.receiveAttack).toHaveBeenCalledWith({ x: 2, y: 2 });
            expect(updateDOM).toHaveBeenCalledWith(2, 2, 'hit', 'grid1');
            expect(gameboard.areAllShipsSunk).toHaveBeenCalled();
            expect(finalUpdateDOM).toHaveBeenCalledWith('grid1');
            expect(removeGridEventListener).toHaveBeenCalledWith('grid2');
        });

        test('uses correct containerId for grid2', () => {
            gameboardTwo.receiveAttack.mockImplementation(({ x, y }) => 'miss');
            gameboardTwo.areAllShipsSunk.mockReturnValue(false);

            processAttack(3, 3, gameboardTwo);

            expect(gameboardTwo.receiveAttack).toHaveBeenCalledWith({ x: 3, y: 3 });
            expect(updateDOM).toHaveBeenCalledWith(3, 3, 'miss', 'grid1');
            expect(gameboardTwo.areAllShipsSunk).toHaveBeenCalled();
            expect(finalUpdateDOM).not.toHaveBeenCalledWith();
            expect(removeGridEventListener).not.toHaveBeenCalledWith();
        });
    }); 

    jest.useFakeTimers();

    describe('switchPlayer function', () => {
        let processAttackMock;
        let currentPlayerMock;
        let opponentPlayerMock;
        let currentTargetedGridMock;
        let opponentGridMock;

        beforeEach(() => {
            processAttackMock = jest.spyOn(gameModule, 'processAttack').mockImplementation(() => {});
            currentPlayerMock = { type: 'computer', makeRandomMove: jest.fn(currentTargetedGridMock).mockReturnValue({ x: 1, y: 1 }) };
            opponentPlayerMock = { type: 'real' };
            currentTargetedGridMock = { size: 10 };
            opponentGridMock = { size: 10 };

            gameModule.currentPlayer = currentPlayerMock;
            gameModule.opponentPlayer = opponentPlayerMock;
            gameModule.currentTargetedGrid = currentTargetedGridMock;
            gameModule.opponentGrid = opponentGridMock;
            
            jest.clearAllMocks();
        })

        afterEach(() => {
            jest.restoreAllMocks();
        });

        test('switches to computer player and makes a random move', () => {
            switchPlayer();

            expect(removeGridEventListener).toHaveBeenCalledWith('grid2');
            jest.advanceTimersByTime(2500);
        });

        test('switches to real player and adds event listener', () => {
            gameModule.currentPlayer = opponentPlayerMock;
            gameModule.opponentPlayer = currentPlayerMock;

            switchPlayer();

            expect(addGridEventListener).toHaveBeenCalled();
            expect(removeGridEventListener).not.toHaveBeenCalled();
            expect(processAttackMock).not.toHaveBeenCalled();
        });
    }); 
});
