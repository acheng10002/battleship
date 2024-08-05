import { Player } from "./battleship.js";
import { updateDOM, finalUpdateDOM, addGridEventListener, removeGridEventListener } from "./dom.js";

const playerOne = new Player('real');
const gameboardOne = playerOne.gameboard;
gameboardOne.placeShip("carrier", 5, { x: 4, y: 2 }, { x: 4, y: 6 });
gameboardOne.placeShip("battleship", 4, { x: 1, y: 8 }, { x: 4, y: 8 });
gameboardOne.placeShip("destroyer", 3, { x: 6, y: 7 }, { x: 8, y: 7 });
gameboardOne.placeShip("submarine", 3, { x: 8, y: 0 }, { x: 8, y: 2 });
gameboardOne.placeShip("patrol boat", 2, { x: 1, y: 0 }, { x: 2, y: 0 });

const playerTwo = new Player('computer');
const gameboardTwo = playerTwo.gameboard;
gameboardTwo.placeShip("carrier", 5, { x: 1, y: 8 }, { x: 5, y: 8 });
gameboardTwo.placeShip("battleship", 4, { x: 8, y: 2 }, { x: 8, y: 5 });
gameboardTwo.placeShip("destroyer", 3, { x: 1, y: 0 }, { x: 3, y: 0 });
gameboardTwo.placeShip("submarine", 3, { x: 4, y: 5 }, { x: 6, y: 5 });
gameboardTwo.placeShip("patrol boat", 2, { x: 1, y: 5 }, { x: 1, y: 6 });

let currentPlayer = playerOne;
let opponentPlayer = playerTwo;

let currentTargettedGrid = gameboardTwo;
let opponentGrid = gameboardOne;

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
        // if they are, appropriate alert message
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
    [currentTargettedGrid, opponentGrid] = [opponentGrid, currentTargettedGrid];

    // if currentPlayer is computer, opponentPlayer/real player should not be allowed to click positions
    if (currentPlayer.type === 'computer') {
        removeGridEventListener('grid2');
        // generates a random move by the computer in 2.5 s
        setTimeout(() => {
            const { x, y } = currentPlayer.makeRandomMove(currentTargettedGrid);
            // processes the move on the real player's gameboard
            processAttack(x, y, currentTargettedGrid);
        }, 2500);   
    } else {
        // otherwise, if the currentPlayer is the real player, listen for click on position
        addGridEventListener('grid2', currentTargettedGrid);
    }
}

export { gameboardOne, gameboardTwo, processAttack };


