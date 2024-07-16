class Ship {
  constructor(name, length) {
    this.name = name;
    // length property
    this.length = length;
    // timesHit property
    this.timesHit = 0;
    // sunk property
    this.sunk = false;
    this.coordinates = [];
  }
  // hit() increases the number of hits on the ship
  hit() {
    return ++this.timesHit;
  }

  // isSUnk calculates whether a ship is considered sunk based on its length and the number of hits it has received
  isSunk() {
    if (this.length === this.timesHit) {
      this.sunk = true;
    }
    return this.sunk;
  }
}

class Gameboard {
  constructor() {
    // initializes gameboard size to 10
    this.size = 10;
    // calls createGrid to initialize the grid
    this.grid = this.createGrid();
    // initializes an empty array to keep track of ships
    this.ships = [];
    // initializes an empty array to keep track of misses
    this.misses = [];
  }

  createGrid() {
    // initializes an empty array to hold the grid
    const grid = [];
    // iterates over x to create each row of the grid
    for (let x = 0; x < this.size; x++) {
      const row = [];
      // iterates over y to create each cell within the current row
      for (let y = 0; y < this.size; y++) {
        /* adds cells to the current row
        each cell is an object with x property that holds the value of the x coordinate,
        y property that holds the value of the y coordinate, and ship property that is currently set to null
        but later can be assigned to a Ship object */
        row.push({ x, y, ship: null });
      }
      // adds the current row to the grid, after all of the current row's cells are added
      grid.push(row);
    }
    return grid;
  }
  // checks if x- and y- coordinates fall between 0 and 10
  areValidCoordinates(x, y) {
    return x >= 0 && x < this.size && y >= 0 && y < this.size;
  }

  // place ships at specific coordinates by calling the ship class
  placeShip(name, length, { startX, startY }, { endX, endY }) {
    // checks if the start and end pair of coordinates are valid
    if (
      !this.areValidCoordinates(startX, startY) ||
      !this.areValidCoordinates(endX, endY)
    ) {
      // if not, throws an error with a message
      throw new Error("Invalid coordinates");
    }

    // determines the ship's horizontal length; if > 1, the ship is placed horizontally
    const lengthX = Math.abs(endX - startX) + 1;
    // determines the ship's vertical length; if > 1, the ship is placed vertically
    const lengthY = Math.abs(endY - startY) + 1;

    /* if both horizontal and vertical lengths are 1, or if
    neither the horizontal nor the vertical length equals the length passed in */
    if (
      (lengthX !== 1 && lengthY !== 1) ||
      (lengthX === 1 && lengthY !== length) ||
      (lengthY === 1 && lengthX !== length)
    ) {
      // throw an error with a message
      throw new Error("Invalid ship placement");
    }

    // if the length is equal to the horizontal length, isHorizontal = true
    const isHorizontal = lengthX === length;
    // if the length is equal to the vertical length, isVertical = true
    const isVertical = lengthY === length;

    // if the ship is placed horizontally
    if (isHorizontal) {
      /* iterate over the cells between {startX, startY} and {endX, startY} 
      (in this case, startY === endY since the ship is horizontally placed */
      for (let x = startX; x <= endX; x++) {
        // if any of the cells are already occupied by a Ship object
        if (this.grid[x][startY].ship !== null) {
          // throw an error with a message
          throw new Error("Position already occupied");
        }
      }
      // if the ship is placed vertically
    } else if (isVertical) {
      /* iterate over the cells between {startX, startY} and {startX, endY} 
      (in this case, startX === endX since the ship is vertically placed */
      for (let y = startY; y <= endY; y++) {
        // if any of the cells are already occupied by a Ship object
        if (this.grid[startX][y].ship !== null) {
          // throw an error with a message
          throw new Error("Possible already occupied");
        }
      }
    }

    // calls Ship class constructor
    const newShip = new Ship(name, length);

    // if isHorizontal is true
    if (isHorizontal) {
      // iterate over the cells between {startX, startY} and {endX, startY}
      for (let x = startX; x <= endX; x++) {
        // set each cell's ship property to the newShip object
        this.grid[x][startY].ship = newShip;
        // pushes each cell's coordinates into the newShip's coordinates property array
        newShip.coordinates.push({ x, y: startY });
      }
      // if isVertical is true
    } else if (isVertical) {
      // iterate over the cells between {startX, startY} and {startX, endY}
      for (let y = startY; y <= endY; y++) {
        // set each cell's ship property to the newShip object
        this.grid[startX][y].ship = newShip;
        // pushes each cell's coordinates into the newShip's coordinates property array
        newShip.coordinates.push({ x: startX, y });
      }
    }
    // pushes newShip object into the Gameboard's ships property array
    this.ships.push(newShip);
  }

  // takes a pair of coodinates and signals whether or not a ship is hit
  receiveAttack(x, y) {
    // checks if the pair of coordinates is valid
    if (!this.areValidCoordinates(x, y)) {
      // if not, throw an error with a message
      throw new Error("Invalid coordinates");
    }

    // determines if the attack hit a ship
    const target = this.grid[x][y].ship;
    if (target) {
      // if it does, sends the hit function to the correct ship
      target.hit();
      // determines if the ship hit is now sunk
      return target.isSunk() ? "sunk" : "hit";
    } else {
      // keeps track of misses so they be displayed properly
      this.misses.push({ x, y });
    }
  }
}

module.exports = {
  Ship,
  Gameboard,
};
