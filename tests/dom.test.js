import { createGrid, updateDOM, finalUpdateDOM, addGridEventListener, removeGridEventListener } from "../src/dom.js";
import "@testing-library/jest-dom";
import { screen } from "@testing-library/dom";

describe("createGrid function", () => {
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

    test('creates a grid and adds appropriate classes and styles', () => {
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
});
