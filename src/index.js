import Board from './board.js'
import Toolbar from './toolbar.js'
import Settings from './settings.js'
import BadBFS from './algorithms/bad_bfs'
import GoodBFS from './algorithms/good_bfs'
import Graph from './algorithms/graph'
import "./styles/index.scss";
// debugger
document.addEventListener("DOMContentLoaded", ()=>{
    const board = new Board();
    board.setStart(10, 10);
    board.setTarget(15, 29);
    const settings = new Settings();
    // const algorithmMaker = new AlgorithmMaker(settings);
    // const badbfs = new BadBFS(board);
    const goodBfs = new GoodBFS(board);
    const toolbar = new Toolbar(settings, goodBfs.startRecursive, board);
    // debugger
})