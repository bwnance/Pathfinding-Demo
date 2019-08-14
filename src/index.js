import Board from './board.js'
import Toolbar from './toolbar.js'
import Settings from './settings.js'
import "./styles/index.scss";
// debugger
document.addEventListener("DOMContentLoaded", ()=>{
    const board = new Board();
    board.setStart(10, 10);
    board.setTarget(15, 29);
    const settings = new Settings();
    const toolbar = new Toolbar(settings, board);
})