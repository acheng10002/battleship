import { gameboardOne, gameboardTwo } from "./game.js";

function createGrid(containerId, gameboard) {
  const container = document.getElementById(containerId);
  container.classList.add("grid-container");
  container.style.gridTemplateColumns = `repeat(${gameboard.size}, 40px)`;
  container.style.gridTemplateRows = `repeat(${gameboard.size}, 40px)`;

  gameboard.grid.forEach((row) => {
    row.forEach((cell) => {
      const cellDiv = document.createElement("div");
      cellDiv.classList.add("grid-cell");
      if (cell.ship) {
        cellDiv.classList.add("ship-cell");
      }
      container.appendChild(cellDiv);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  createGrid("grid1", gameboardOne);
  createGrid("grid2", gameboardTwo);
});
