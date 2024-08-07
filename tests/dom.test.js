import { createGrid, addGridEventListener, removeGridEventListener, updateDOM, finalUpdateDOM } from "../src/dom.js";
import { processAttack } from "../src/game.js";
import * as domModule from "../src/dom.js";
import * as gameModule from "../src/game.js";
import "@testing-library/jest-dom";
import { fireEvent } from "@testing-library/dom";

jest.mock('../src/game.js', () => ({
    ...jest.requireActual('../src/game.js'),
    processAttack: jest.fn(),
}));

describe("createGrid and event listener dom functions", () => {
    let gameboard;

    beforeEach(() => {
        gameboard = {
            size: 10,
            grid: Array.from({ length: 10 }, (_, x) =>
                Array.from({ length: 10 }, (_, y) => ({
                    x,
                    y,
                    ship: x === 0 && y === 0 ? { name: 'testShip' } : null,
                }))
            ),
        };
        document.body.innerHTML = '<div id="user-grid"></div>'; 
    });

    test('createGrid and adds appropriate classes and styles', () => {
        createGrid('user-grid', gameboard, true);

        const container = document.getElementById('user-grid');

        expect(container).toHaveClass('grid-container');
        expect(container.style.gridTemplateColumns).toBe('repeat(10, 40px)');
        expect(container.style.gridTemplateRows).toBe('repeat(10, 40px)');

        const cells = container.querySelectorAll('.grid-cell');
        expect(cells.length).toBe(100);

        cells.forEach((cell, index) => {
            const x = Math.floor(index / 10);
            const y = index % 10;
            expect(cell).toHaveAttribute('data-coords', `${x},${y}`);

            if (x === 0 && y === 0) {
                expect(cell).toHaveClass('ship-cell');
            } else {
                expect(cell).not.toHaveClass('ship-cell');
            }
        });
    });

    test('adds hide-ship-cell class to the constainer if isUserGrid is false', () => {
        createGrid('user-grid', gameboard, false);

        const container = document.getElementById('user-grid');
        expect(container).toHaveClass('hide-ship-cell');
    });

    test('addGridEventListener and removeGridEventListener', () => {
        createGrid('user-grid', gameboard, false);
        addGridEventListener("user-grid", gameboard);

        const container = document.getElementById('user-grid');
        const cellDiv = container.querySelector('.grid-cell[data-coords ="0,0"]');

        fireEvent.click(cellDiv);
        expect(processAttack).toHaveBeenCalledWith(0, 0, gameboard);

        removeGridEventListener("user-grid");
        
        expect(container.clickHandler).toBeUndefined();

        processAttack.mockClear();
    });
});

describe('setupButtonListener', () => {
    let button, turnResult;

    beforeEach(() => {
        document.body.innerHTML = `
        <div>
            <h2 id="turn-result"></h2>
            <div id="grid1"></div>
            <div id="grid2"></div>
            <button id="button">Randomize & Restart</button>
        </div>
        `;

        button = document.getElementById("button");
        turnResult = document.getElementById("turn-result");
    });

    test('sets up the button click listener', () => {

        const createGridSpy = jest.spyOn(domModule, 'createGrid').mockImplementation(jest.fn());
        const randomizeShipPlacementSpy = jest.spyOn(gameModule, 'randomizeShipPlacement').mockImplementation(jest.fn());

        domModule.setupButtonListener();

        button.click();

        expect(turnResult.textContent).toBe("Let's go!");
        createGridSpy.mockRestore();
        randomizeShipPlacementSpy.mockRestore();
    });
});

describe('updateDOM and finalUpdateDOM functions', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <div id="grid1">
                ${Array.from({ length: 10 }, (_, x) =>
                    Array.from({ length: 10 }, (_, y) =>
                        `<div class="grid-cell" data-coords="${x},${y}"></div>`
                    ).join('')
                ).join('')}
            </div>
            <div id="grid2">
                ${Array.from({ length: 10 }, (_, x) =>
                    Array.from({ length: 10 }, (_, y) =>
                        `<div class="grid-cell" data-coords="${x},${y}"></div>`
                    ).join('')
                ).join('')}
            </div>
            <div id="whose-turn"></div>
            <div id="turn-result"></div>
            <div id="direction"></div>       
        `;
    });

    test('updates DOM correctly on a hit for real player', () => {
        updateDOM(0, 0, 'hit', 'grid2');
        const cellDiv = document.querySelector('#grid2 div[data-coords="0,0"]');
        const whoseTurn = document.getElementById('whose-turn');
        const turnResult = document.getElementById('turn-result');
        const direction = document.getElementById('direction');

        expect(cellDiv).toHaveClass('cell-hit');
        expect(turnResult).toHaveTextContent("You hit one of their ships!");
        expect(whoseTurn).toHaveTextContent("Computer's Turn");
        expect(direction).toHaveTextContent("Computer is choosing a cell on your grid...");
    });

    test('updates DOM correctly on a miss for real player', () => {
        updateDOM(1, 1, 'miss', 'grid2');
        const cellDiv = document.querySelector('#grid2 div[data-coords="1,1"]');
        const whoseTurn = document.getElementById('whose-turn');
        const turnResult = document.getElementById('turn-result');
        const direction = document.getElementById('direction');

        expect(cellDiv).toHaveClass('cell-miss');
        expect(turnResult).toHaveTextContent("You missed.");
        expect(whoseTurn).toHaveTextContent("Computer's Turn");
        expect(direction).toHaveTextContent("Computer is choosing a cell on your grid...");
    });

    test('updates DOM correctly on a hit for computer', () => {
        updateDOM(2, 2, 'hit', 'grid1');
        const cellDiv = document.querySelector('#grid1 div[data-coords="2,2"]');
        const whoseTurn = document.getElementById('whose-turn');
        const turnResult = document.getElementById('turn-result');
        const direction = document.getElementById('direction');

        expect(cellDiv).toHaveClass('cell-hit');
        expect(turnResult).toHaveTextContent("One of your ships got hit!");
        expect(whoseTurn).toHaveTextContent("Your Turn");
        expect(direction).toHaveTextContent("Click a cell on your opponent\'s grid.");
    });

    test('updates DOM correctly on a miss for computer', () => {
        updateDOM(3, 3, 'miss', 'grid1');
        const cellDiv = document.querySelector('#grid1 div[data-coords="3,3"]');
        const whoseTurn = document.getElementById('whose-turn');
        const turnResult = document.getElementById('turn-result');
        const direction = document.getElementById('direction');

        expect(cellDiv).toHaveClass('cell-miss');
        expect(turnResult).toHaveTextContent("Computer missed.");
        expect(whoseTurn).toHaveTextContent("Your Turn");
        expect(direction).toHaveTextContent("Click a cell on your opponent\'s grid.");
    });

    test('does not update DOM if cell already attacked', () => {
        const cellDiv = document.querySelector('#grid2 div[data-coords="4,4"]');
        cellDiv.classList.add('cell-hit');

        updateDOM(4, 4, 'hit', 'grid2');
        const turnResult = document.getElementById('turn-result');

        expect(turnResult).toHaveTextContent("Cell already attacked.");
    });

    test('final update to DOM if real player wins', () => {
        finalUpdateDOM('grid2');
        const whoseTurn = document.getElementById('whose-turn');
        const turnResult = document.getElementById('turn-result');
        const direction = document.getElementById('direction');

        expect(turnResult).toHaveTextContent("");
        expect(whoseTurn).toHaveTextContent("You Win!");
        expect(direction).toHaveTextContent("");
    });

    test('final update to DOM if computer wins', () => {
        finalUpdateDOM('grid1');
        const whoseTurn = document.getElementById('whose-turn');
        const turnResult = document.getElementById('turn-result');
        const direction = document.getElementById('direction');

        expect(turnResult).toHaveTextContent("");
        expect(whoseTurn).toHaveTextContent("Computer Wins.");
        expect(direction).toHaveTextContent("");
    });
});
