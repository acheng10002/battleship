import { createGrid, addGridEventListener } from './dom.js';
import { gameboardOne, gameboardTwo } from './game.js';
import './styles.css';

// once the html document is loaded, create gameboards for user and their opponent
document.addEventListener('DOMContentLoaded', () => {
  // third argument, isUserGrid is either true or false
  createGrid('grid1', gameboardOne, true);
  createGrid('grid2', gameboardTwo, false);
  // if grid1 is the user's grid, grid2 is the computer's and requires event listeners
  addGridEventListener('grid2', gameboardTwo);
});

