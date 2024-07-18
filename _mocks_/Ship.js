const Ship = jest.fn().mockImplementation((name, length) => {
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
});

module.exports = Ship;
