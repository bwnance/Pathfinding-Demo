import Board from './board.js'
import Toolbar from './toolbar.js'
import Settings from './settings.js'
import BFS from './algorithms/bfs'
import "./styles/index.scss";
// debugger
document.addEventListener("DOMContentLoaded", ()=>{
    const board = new Board();
    board.setStart(10, 10);
    board.setTarget(15, 29);
    const settings = new Settings();
    // const algorithmMaker = new AlgorithmMaker(settings);
    const bfs = new BFS(board);
    const toolbar = new Toolbar(settings, bfs.start, board);
    
})