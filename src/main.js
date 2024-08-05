import { createGrid, addGridEventListener } from './dom.js';
import { gameboardOne, gameboardTwo } from './game.js';
import './styles.css';

// once the html document is loaded, create gameboards for user and their opponent
document.addEventListener('DOMContentLoaded', () => {
  createGrid('grid1', gameboardOne, true);
  createGrid('grid2', gameboardTwo, false);
  addGridEventListener('grid2', gameboardTwo);
});

