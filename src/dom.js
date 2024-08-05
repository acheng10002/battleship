import { processAttack } from "./game.js";
/* *** in programming, x is the row index, and y is the column index 
containerId is the id of the HTML element where the grid will be created
gameboard is the object containing grid and its properties */
function createGrid(containerId, gameboard, isUserGrid = true) {
  const container = document.getElementById(containerId);
  // adds grid-container class to grid HTML element for styling 
  container.classList.add("grid-container");

  /* sets CSS grid properties of the grid HTML element
  number of columns and rows are set to the size of the gameboard/10, and each cell is 40 pixels wide and tall */
  container.style.gridTemplateColumns = `repeat(${gameboard.size}, 40px)`;
  container.style.gridTemplateRows = `repeat(${gameboard.size}, 40px)`;

  // add hide-ship-cell class to grid2
  if (!isUserGrid) {
    container.classList.add("hide-ship-cell");
  }

  /* nested iteration over a 2-D array, gameboard.grid, outer loop iterates over each row 
  x is the index of the current row within the gameboard.grid array */
  gameboard.grid.forEach((row, x) => {
    // iterates over each cell in each row, y is the index of each cell within the row  
    row.forEach((cell, y) => {
      // creates a new div element for each cell 
      const cellDiv = document.createElement("div");
      // adds grid-cell class to cellDiv element for styling
      cellDiv.classList.add("grid-cell");
      // data-coords attribute for each cell corresponds to the cell's coordinates (x, y), (row index, column index) 
      cellDiv.dataset.coords = `${x},${y}`;
      // if the cell contains a ship, adds ship-cell class
      if (cell.ship) {
        cellDiv.classList.add("ship-cell");
      }
      container.appendChild(cellDiv);
    });
  });
  /*
  // only adds the event listener to the computer player's gameboard
  if (!isUserGrid) {
    // adds a click event listener to the container
    container.addEventListener('click', (event) => {
      const cellDiv = event.target;
      // when click happens, event handler checks if the target of the click has the grid-cell class
      if (cellDiv.classList.contains('grid-cell')) {
        /* if click target has grid-cell class, extracts the coordinates from data-coords attribute
        split splits the string into an array of substrings
        map applies the Number function to each element of the array 
        const [x, y] = cellDiv.dataset.coords.split(',').map(Number);
        // processes the real player's attack on the computer's gameboard 
        processAttack(x, y, gameboard);
      }
    });
  }
  */
}

function addGridEventListener(containerId, gameboard) {
  const container = document.getElementById(containerId);
  const clickHandler = (event) => {
    const cellDiv = event.target;
    if (cellDiv.classList.contains('grid-cell')) {
      const [x, y] = cellDiv.dataset.coords.split(',').map(Number);
      processAttack(x, y, gameboard);
    }
  };
  container.addEventListener('click', clickHandler);
  container.clickHandler = clickHandler;
}

function removeGridEventListener(containerId) {
  const container = document.getElementById(containerId);
  if (container.clickHandler) {
    container.removeEventListener('click', container.clickHandler);
    delete container.clickHandler;
  }
}

/* main update to DOM
updates the opponent's gameboard, passing in the x, y coordinates of the cell attacked, 
the hit or miss result, and the gameboard's id attribute */
function updateDOM(x, y, result, containerId) {
  // selects the cell element with the x, y coordinates 
  const cellDiv = document.querySelector(`#${containerId} div[data-coords="${x},${y}"]`);
  // select elements for the turnMessage, hit or miss Message, and directionMessage
  const whoseTurn = document.getElementById("whose-turn");
  const turnResult = document.getElementById("turn-result");
  const direction = document.getElementById("direction");
 
  const isPlayerTurn = containerId === 'grid2';

  /* assigns turnMessage, hit or missMessage, and directionMessage based on 
  whether attack hit, missed, or was a repeat */
  const updateTextContent = (hitMessage, missMessage, turnMessage, directionMessage) => {
    if (result === 'hit' && !cellDiv.classList.contains('cell-hit')) {
      cellDiv.classList.add('cell-hit');
      turnResult.textContent = hitMessage;
      whoseTurn.textContent = turnMessage;
      direction.textContent = directionMessage;
    } else if (result === 'miss' && !cellDiv.classList.contains('cell-miss')) {
      cellDiv.classList.add('cell-miss');
      turnResult.textContent = missMessage;
      whoseTurn.textContent = turnMessage;
      direction.textContent = directionMessage;
    } else {
      turnResult.textContent = "Cell already attacked.";
    }
  };
  /* passes in turnMessage, hit or miss Message, and directionMessage based on 
  if it's the player's turn or the computer's turn */
  if (isPlayerTurn) {
    updateTextContent(
      "You hit one of their ships!",
      "You missed.",
      "Computer's Turn",
      "Computer is choosing a cell on your grid..."
    );
  } else {
    updateTextContent(
      "One of your ships got hit!",
      "Computer missed.",
      "Your Turn",
      "Click a cell on your opponent's grid."
    );
  }
}

// also update to DOM for win conditions
function finalUpdateDOM(containerId) {
  const whoseTurn = document.getElementById("whose-turn");
  const turnResult = document.getElementById("turn-result");
  turnResult.textContent = "";
  const direction = document.getElementById("direction");
  direction.textContent = "";
  if (containerId === 'grid1') {
    whoseTurn.textContent = "Computer Wins.";
  } else {
    whoseTurn.textContent = "You Win!";
  }

}

export { createGrid, updateDOM, finalUpdateDOM, addGridEventListener, removeGridEventListener };


