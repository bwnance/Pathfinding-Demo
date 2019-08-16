import BadBFS from "./algorithms/bad_bfs";
import GoodBFS from "./algorithms/good_bfs";
import Dijkstra from "./algorithms/dijkstra";
import GreedyBestFirst from "./algorithms/greedy_best_first";
import AStar from "./algorithms/a_star";
import Two from "two.js";
export default class Toolbar {
	constructor(settings, board) {
		this.board = board;
		this.settings = settings;
		this.handleSearchClick = this.handleSearchClick.bind(this);
		this.handleAStarClick = this.handleAStarClick.bind(this);
		this.handleClearWalls = this.handleClearWalls.bind(this);
		this.handleClearPath = this.handleClearPath.bind(this);
		this.handleBadBFSClick = this.handleBadBFSClick.bind(this);
		this.handleGoodBFSClick = this.handleGoodBFSClick.bind(this);
		this.handleDijkstraClick = this.handleDijkstraClick.bind(this);
		this.handleGreedyBestFirstClick = this.handleGreedyBestFirstClick.bind(
			this
		);
		this.handleSVGClick = this.handleSVGClick.bind(this);
		this.handleWebGLClick = this.handleWebGLClick.bind(this);
		this.handleCanvasClick = this.handleCanvasClick.bind(this);
		this.currentAlgorithmElement = document.getElementById("current-algorithm");
		this.setupEventListeners();
	}
	setupEventListeners() {
		document
			.getElementById("search")
			.addEventListener("click", () => setTimeout(this.handleSearchClick, 0));
		document
			.getElementById("a*")
			.addEventListener("click", this.handleAStarClick);
		document
			.getElementById("good-bfs")
			.addEventListener("click", this.handleGoodBFSClick);
		document
			.getElementById("dijkstra")
			.addEventListener("click", this.handleDijkstraClick);
		document
			.getElementById("greedy")
			.addEventListener("click", this.handleGreedyBestFirstClick);
		document
			.getElementById("clear-walls")
			.addEventListener("click", this.handleClearWalls);
		document
			.getElementById("clear-path")
			.addEventListener("click", this.handleClearPath);

		document
			.getElementById("svg-label")
			.addEventListener("click", this.handleSVGClick);
		document
			.getElementById("webgl-label")
			.addEventListener("click", this.handleWebGLClick);
		document
			.getElementById("canvas-label")
			.addEventListener("click", this.handleCanvasClick);
	}
	handleSVGClick() {
		if (this.board.params.type === Two.Types.svg) return;
		this.board.params.type = Two.Types.svg;
		this.board.destroyFG();
		this.board.setupFG();
	}
	handleWebGLClick() {
		if (this.board.params.type === Two.Types.webgl) return;
		this.board.params.type = Two.Types.webgl;
		this.board.destroyFG();
		this.board.setupFG();
	}
	handleCanvasClick() {
		if (this.board.params.type === Two.Types.canvas) return;
		this.board.params.type = Two.Types.canvas;
		this.board.destroyFG();
		this.board.setupFG();
	}
	handleSearchClick() {
		const radioParent = document.getElementsByClassName("mode-radios")[0];
		for (let i = 0; i < radioParent.children.length; i++) {
			const radio = radioParent.children[i].children[0];
			if (radio.checked) {
				this.settings.mode = parseInt(radio.value);
				break;
			}
		}
		switch (this.settings.algorithm) {
			case "A_STAR":
				const aStar = new AStar(this.board, this.settings);
				aStar.start();
				this.setStats(aStar.runtime, aStar.steps);
				break;
			case "DIJKSTRA":
				const dijkstra = new Dijkstra(this.board, this.settings);
				dijkstra.start();
				this.setStats(dijkstra.runtime, dijkstra.steps);
				break;
			case "GOOD_BFS":
				const goodBFS = new GoodBFS(this.board, this.settings);
				goodBFS.start();
				this.setStats(goodBFS.runtime, goodBFS.steps);
				break;
			case "GREEDY":
				const greedy = new GreedyBestFirst(this.board, this.settings);
				greedy.start();
				this.setStats(greedy.runtime, greedy.steps);
				break;
		}
	}
	setStats(runtime, steps) {
		document.getElementById(
			"stats"
		).children[0].innerText = `Runtime: ${runtime.toFixed(2)}ms`;
		document.getElementById("stats").children[1].innerText = `Steps: ${steps}`;
	}
	handleAStarClick() {
		this.currentAlgorithmElement.innerText = "A*";
		this.settings.algorithm = "A_STAR";
	}
	handleBadBFSClick() {
		this.settings.algorithm = "BAD_BFS";
	}
	handleGoodBFSClick() {
		this.currentAlgorithmElement.innerText = "Breadth First Search";
		this.settings.algorithm = "GOOD_BFS";
	}
	handleGreedyBestFirstClick() {
		this.currentAlgorithmElement.innerText = "Greedy Best-First Search";
		this.settings.algorithm = "GREEDY";
	}
	handleDijkstraClick() {
		this.currentAlgorithmElement.innerText = "Dijkstra";
		this.settings.algorithm = "DIJKSTRA";
	}
	handleClearWalls() {
		this.board.clearWalls();
	}
	handleClearPath() {
		this.board.clearPath(false);
	}
}
