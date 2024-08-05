import { Gameboard, Player } from "./src/battleship";

describe("Ship class real implementation", () => {
  let ship;

  beforeEach(() => {
    jest.unmock("./src/battleship");
    const { Ship: RealShip } = require("./src/battleship");
    ship = new RealShip("testShip", 5);
  });

  test("Ship properties", () => {
    expect(ship.name).toBe("testShip");
    expect(ship.length).toBe(5);
    expect(ship.timesHit).toBe(0);
    expect(ship.sunk).toBe(false);
    expect(ship.coordinates).toEqual([]);
  });

  test("hit should increment hits correctly", () => {
    expect(ship.hit()).toBe(1);
    expect(ship.timesHit).toBe(1);
  });

  test("isSunk should return correct value", () => {
    for (let i = 0; i < 4; i++) {
      ship.hit();
    }
    expect(ship.isSunk()).toBe(false);
    ship.hit();
    expect(ship.isSunk()).toBe(true);
  });

  test("isSunk should handle edge cases", () => {
    expect(ship.isSunk()).toBe(false);
    for (let i = 0; i < 5; i++) {
      ship.hit();
    }
    expect(ship.isSunk()).toBe(true);
    ship.hit();
    expect(ship.isSunk()).toBe(true);
  });
});

// const carrier = new Ship("Carrier", 5);
// const battleship = new Ship("Battleship", 4);
// const cruiser = new Ship("Cruiser", 3);
// const submarine = new Ship("Submarine", 3);
// const destroyer = new Ship("Destroyer", 2);

describe("Gameboard with mocked Ship", () => {
  let gameboard;

  beforeAll(() => {
    jest.mock("./src/battleship", () => {
      const originalModule = jest.requireActual("./src/battleship");
      return {
        ...originalModule,
        Ship: jest.fn().mockImplementation((name, length) => {
          return {
            name: name,
            length: length,
            timesHit: 0,
            sunk: false,
            coordinates: [],
            hit: jest.fn().mockImplementation(function () {
              return ++this.timesHit;
            }),
            isSunk: jest.fn().mockImplementation(function () {
              if (this.timesHit === this.length) {
                this.sunk = true;
              }
              return this.sunk;
            }),
          };
        }),
      };
    });
  });

  beforeEach(() => {
    const { Gameboard: MockedGameboard } = require("./src/battleship");
    gameboard = new MockedGameboard();
  });

  afterAll(() => {
    jest.unmock("./src/battleship");
  });

  test("Gameboard properties", () => {
    expect(gameboard.size).toBe(10);
    expect(gameboard.grid).toEqual(gameboard.createGrid());
    expect(gameboard.ships).toEqual([]);
    expect(gameboard.misses).toEqual([]);
  });

  test("areValidCoordinates should check coordinates", () => {
    expect(gameboard.areValidCoordinates({ x: 11, y: 11 })).toBe(false);
    expect(gameboard.areValidCoordinates({ x: 5, y: 5 })).toBe(true);
  });

  test("placeShip should call Ship class and place ship at specific coordinates", () => {
    gameboard.placeShip("testShip", 5, { x: 0, y: 0 }, { x: 4, y: 0 });
    expect(gameboard.grid[0][0].ship).toEqual(gameboard.ships[0]);
    expect(gameboard.grid[1][0].ship).toEqual(gameboard.ships[0]);
    expect(gameboard.grid[2][0].ship).toEqual(gameboard.ships[0]);
    expect(gameboard.grid[3][0].ship).toEqual(gameboard.ships[0]);
    expect(gameboard.grid[4][0].ship).toEqual(gameboard.ships[0]);
    expect(gameboard.ships[0].coordinates).toEqual([
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 3, y: 0 },
      { x: 4, y: 0 },
    ]);
  });

  test("placeShip should not allow overlapping ships", () => {
    gameboard.placeShip("testShip1", 4, { x: 1, y: 1 }, { x: 4, y: 1 });
    expect(() => {
      gameboard.placeShip("testShip1", 3, { x: 1, y: 1 }, { x: 3, y: 1 });
    }).toThrow("Position already occupied");
  });

  test("placeShip should not allow ships out of bounds", () => {
    expect(() => {
      gameboard.placeShip("testShip", 3, { x: 9, y: 1 }, { x: 11, y: 1 });
    }).toThrow("Invalid coordinates");
  });

  test("placeShip should allow ships at the edge of the grid", () => {
    gameboard.placeShip("testShip", 3, { x: 9, y: 1 }, { x: 9, y: 3 });
    expect(gameboard.grid[9][1].ship).toEqual(gameboard.ships[0]);
    expect(gameboard.grid[9][2].ship).toEqual(gameboard.ships[0]);
    expect(gameboard.grid[9][3].ship).toEqual(gameboard.ships[0]);
  });

  test("receiveAttack should register hits and misses correctly", () => {
    gameboard.placeShip("testShip", 4, { x: 0, y: 1 }, { x: 0, y: 4 });
    expect(gameboard.receiveAttack({ x: 1, y: 1 })).toBe(false);
    expect(gameboard.receiveAttack({ x: 0, y: 1 })).toBe(false);
    expect(gameboard.receiveAttack({ x: 0, y: 2 })).toBe(false);
    expect(gameboard.receiveAttack({ x: 0, y: 3 })).toBe(false);
    expect(gameboard.receiveAttack({ x: 0, y: 4 })).toBe(true);
    expect(gameboard.misses).toEqual([{ x: 1, y: 1 }]);
  });

  test("receiveAttack should sink the ship after enough hits", () => {
    gameboard.placeShip("testShip", 3, { x: 0, y: 5 }, { x: 0, y: 7 });
    gameboard.receiveAttack({ x: 0, y: 5 });
    gameboard.receiveAttack({ x: 0, y: 6 });
    gameboard.receiveAttack({ x: 0, y: 7 });
    expect(gameboard.ships[0].timesHit).toBe(3);
    expect(gameboard.grid[0][5].ship.sunk).toBe(true);
  });

  test("receiveAttach should handle multiple ships", () => {
    gameboard.placeShip("testShip1", 2, { x: 3, y: 3 }, { x: 4, y: 3 });
    gameboard.placeShip("testShip2", 2, { x: 3, y: 6 }, { x: 4, y: 6 });
    gameboard.receiveAttack({ x: 3, y: 3 });
    gameboard.receiveAttack({ x: 4, y: 3 });
    expect(gameboard.ships[0].isSunk()).toBe(true);
    expect(gameboard.ships[1].isSunk()).toBe(false);
  });

  test("areAllShipsSunk should handle not all ships being sunk", () => {
    gameboard.placeShip("testShip1", 2, { x: 3, y: 4 }, { x: 4, y: 4 });
    gameboard.placeShip("testShip2", 2, { x: 3, y: 7 }, { x: 4, y: 7 });
    gameboard.receiveAttack({ x: 3, y: 4 });
    gameboard.receiveAttack({ x: 4, y: 4 });
    gameboard.receiveAttack({ x: 3, y: 7 });
    expect(gameboard.areAllShipsSunk()).toBe(false);
  });

  test("areAllShipsSunk should handle all ships being sunk", () => {
    gameboard.placeShip("testShip1", 2, { x: 3, y: 5 }, { x: 4, y: 5 });
    gameboard.placeShip("testShip2", 2, { x: 3, y: 8 }, { x: 4, y: 8 });
    gameboard.receiveAttack({ x: 3, y: 5 });
    gameboard.receiveAttack({ x: 4, y: 5 });
    gameboard.receiveAttack({ x: 3, y: 8 });
    gameboard.receiveAttack({ x: 4, y: 8 });
    expect(gameboard.areAllShipsSunk()).toBe(true);
  });
});

describe("Player", () => {
  let player;

  test("Player property when player is real", () => {
    player = new Player("real");
    expect(player.type).toBe("real");
  });

  test("Player property when player is computer", () => {
    player = new Player("computer");
    expect(player.type).toBe("computer");
  });

  test("createGameboard should create a gameboard for each player", () => {
    player = new Player("real");
    expect(player.gameboard).toEqual(player.createGameboard());
  });
});
