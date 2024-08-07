import { Player } from "./battleship.js";
import { updateDOM, finalUpdateDOM, addGridEventListener, removeGridEventListener } from "./dom.js";

// array of the 5 ship objects with name and length properties
const SHIP_TYPES = [
    { name: "carrier", length: 5 },
    { name: "battleship", length: 4 },
    { name: "destroyer", length: 3 },
    { name: "submarine", length: 3 },
    { name: "patrol boat", length: 2 },
];


function getRandomInt(min, max) {
    /* generates a random floating-point decimal between 0 and 1, 
    multiplies it by (max - min + 1)
    product is a floating-point number, and rounds it down
    adds min to the rounded down product */
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function canPlaceShip(gameboard, length, startX, startY, horizontal) {
    // if the ship is horizontal
    if (horizontal) {
        // if startX + length, goes beyond 10, return false
        if (startX + length > gameboard.size) return false;
        /* if any of the cells between gameboard.grid[startX][startY] and gameboard.grid[startX + (length - 1)][startY] 
        has a ship, return false */
        for (let i = 0; i < length; i++) {
            if (gameboard.grid[startX + i][startY].ship) return false;
        }
    // if the ship is vertical
    } else {
        // if startY + length, goes beyond 10, return galse
        if (startY + length > gameboard.size) return false;
        /* if any of the cells between gameboard.grid[startX][startY] and gameboard.grid[startX][startY + (length - 1)] 
        has a ship, return false */
        for (let i = 0; i < length; i++) {
            if (gameboard.grid[startX][startY + i].ship) return false;
        }
    }
    // otherwise return true
    return true;
}

function placeShipRandomly(gameboard, ship) {
    let placed = false;
    // placed is used to control the while loop, while it is false, the loop runs
    while (!placed) {
        // horizontal is true if Math.random() < 0.5, otherwise it's false
        const horizontal = Math.random() < 0.5;
        // if horizontal, max for startX will be gameboard.size - ship.length (a lower number)
        const startX = getRandomInt(0, gameboard.size - (horizontal ? ship.length : 1));
        // if horizontal, max for startY will be gameboard.size - 1 (a higher number)
        const startY = getRandomInt(0, gameboard.size - (horizontal ? 1 : ship.length));

        // if the ship can be placed in that cell
        if (canPlaceShip(gameboard, ship.length, startX, startY, horizontal)) {
            /* endX is startX + ship.length - 1 if the ship is horizontal 
            endX is startX if the ship is vertical */
            const endX = horizontal ? startX + ship.length - 1 : startX;
            /* endY is startY if the ship is horizontal
            endY is startY + ship.length - 1 if the ship is vertical */
            const endY = horizontal ? startY : startY + ship.length - 1;
            // place the ship at those coordinates on the gameboard
            gameboard.placeShip(ship.name, ship.length, { x: startX, y: startY }, { x: endX, y: endY });
            placed = true;
        }
    }
}

function randomlyPlaceShips(player) {
    // create a gameboard for the player
    const gameboard = player.gameboard;
    // for each ship in SHIP_TYPES, place each randomly on the player's gameboard
    SHIP_TYPES.forEach((ship) => {
        placeShipRandomly(gameboard, ship);
    });
}

function resetGameboard(gameboard) {
    // clear the gameboard's ships property
    gameboard.ships = [];
    gameboard.grid.forEach(row => {
        row.forEach(cell => {
            /* for each cell in each row of the gameboard's grid, make its ship property null and 
            its cellAttacked property false */
            cell.ship = null;
            cell.cellAttacked = false;
        });
    });
}

const playerOne = new Player('real');
randomlyPlaceShips(playerOne);
const gameboardOne = playerOne.gameboard;

const playerTwo = new Player('computer');
randomlyPlaceShips(playerTwo);
const gameboardTwo = playerTwo.gameboard;

let currentPlayer = playerOne;
let opponentPlayer = playerTwo;

let currentTargetedGrid = gameboardTwo;
let opponentGrid = gameboardOne;

function randomizeShipPlacement(gameboardOne, gameboardTwo) {
    resetGameboard(gameboardOne);
    resetGameboard(gameboardTwo);
    randomlyPlaceShips(playerOne);
    gameboardOne.ships = SHIP_TYPES;
    randomlyPlaceShips(playerTwo);
    gameboardTwo.ships = SHIP_TYPES;
}

// processes the player's attack on their opponent's gameboard
function processAttack(x, y, gameboard) {
    // attacks the x, y coordinates of opponent's gameboard and assigns "hit" or "miss" to result
    const result = gameboard.receiveAttack({ x, y });
    // assigns the gameboard's id attribute to containerId
    const containerId = gameboard === gameboardTwo ? 'grid2' : 'grid1';
    // updates the opponent's gameboard DOM
    updateDOM(x, y, result, containerId);
    // checks if all the opponent's ships are sunk
    if (gameboard.areAllShipsSunk()) {
        // if they are, appropriate message
        finalUpdateDOM(containerId);
        removeGridEventListener('grid2');
        return;
    } else {
      switchPlayer();  
    }
}

function switchPlayer() {
    // array destructuring that swaps the current player and opponent player
    [currentPlayer, opponentPlayer] = [opponentPlayer, currentPlayer];
    [currentTargetedGrid, opponentGrid] = [opponentGrid, currentTargetedGrid];

    // if currentPlayer is computer, opponentPlayer/real player should not be allowed to click positions
    if (currentPlayer.type === 'computer') {
        removeGridEventListener('grid2');
        // generates a random move by the computer in 2.5 s
        setTimeout(() => {
            const { x, y } = currentPlayer.makeRandomMove(currentTargetedGrid);
            // processes the move on the real player's gameboard
            processAttack(x, y, currentTargetedGrid);
        }, 2500);   
    } else {
        // otherwise, if the currentPlayer is the real player, listen for click on position
        addGridEventListener('grid2', currentTargetedGrid);
    }
}

export { SHIP_TYPES, gameboardOne, gameboardTwo, playerOne, playerTwo, getRandomInt, placeShipRandomly, randomlyPlaceShips, resetGameboard, randomizeShipPlacement, canPlaceShip, processAttack, switchPlayer };


