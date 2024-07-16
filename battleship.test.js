const { Ship, Gameboard } = require("./battleship");

describe("Ship", () => {
  let ship;

  beforeEach(() => {
    ship = new Ship("testShip", 5);
  });
  test("Ship properties", () => {
    expect(ship.name).toBe("testShip");
    expect(ship.length).toBe(5);
    // expect(ship.timesHit).toBe(0);
    // expect(ship.sunk).toBe(false);
    expect(ship.coordinates).toEqual([]);
  });

  test("hit should increment hits correctly", () => {
    expect(ship.hit()).toBe(1);
  });

  test("isSunk should return correct value", () => {
    for (i = 0; i < 4; i++) {
      ship.hit();
    }
    expect(ship.isSunk()).toBe(false);
    ship.hit();
    expect(ship.isSunk()).toBe(true);
  });
});

const carrier = new Ship("Carrier", 5);
const battleship = new Ship("Battleship", 4);
const cruiser = new Ship("Cruiser", 3);
const submarine = new Ship("Submarine", 3);
const destroyer = new Ship("Destroyer", 2);
