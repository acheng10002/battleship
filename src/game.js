import { Player } from "./battleship";

const playerOne = new Player();

const gameboardOne = playerOne.gameboard;
gameboardOne.placeShip("carrier", 5, { x: 4, y: 2 }, { x: 4, y: 6 });
gameboardOne.placeShip("battleship", 4, { x: 1, y: 8 }, { x: 4, y: 8 });
gameboardOne.placeShip("destroyer", 3, { x: 6, y: 7 }, { x: 8, y: 7 });
gameboardOne.placeShip("submarine", 3, { x: 8, y: 0 }, { x: 8, y: 2 });
gameboardOne.placeShip("patrol boat", 2, { x: 1, y: 0 }, { x: 2, y: 0 });

const playerTwo = new Player();

const gameboardTwo = playerTwo.gameboard;
gameboardTwo.placeShip("carrier", 5, { x: 1, y: 8 }, { x: 5, y: 8 });
gameboardTwo.placeShip("battleship", 5, { x: 8, y: 2 }, { x: 8, y: 5 });
gameboardTwo.placeShip("destroyer", 3, { x: 1, y: 0 }, { x: 3, y: 0 });
gameboardTwo.placeShip("submarine", 3, { x: 4, y: 5 }, { x: 6, y: 5 });
gameboardTwo.placeShip("patrol boat", 2, { x: 1, y: 5 }, { x: 1, y: 6 });

export { gameboardOne, gameboardTwo };
