import GoodBFS from "./algorithms/good_bfs";
import Dijkstra from "./algorithms/dijkstra";
import GreedyBestFirst from "./algorithms/greedy_best_first";
import AStar from "./algorithms/a_star";
import JumpPoint from "./algorithms/jump_point";
import Two from "two.js";
export default class Toolbar {
	constructor(settings, board) {
		this.board = board;
		this.settings = settings;
		this.handleSearchClick = this.handleSearchClick.bind(this);
		this.handleAStarClick = this.handleAStarClick.bind(this);
		this.handleJPSClick = this.handleJPSClick.bind(this);
		this.handleClearWalls = this.handleClearWalls.bind(this);
		this.handleClearPath = this.handleClearPath.bind(this);
		this.handleGoodBFSClick = this.handleGoodBFSClick.bind(this);
		this.handleDijkstraClick = this.handleDijkstraClick.bind(this);
		this.handleBestFirstClick = this.handleBestFirstClick.bind(this);
		this.handleSVGClick = this.handleSVGClick.bind(this);
		this.handleWebGLClick = this.handleWebGLClick.bind(this);
		this.handleCanvasClick = this.handleCanvasClick.bind(this);
		this.handleManhattanClick = this.handleManhattanClick.bind(this);
		this.handleChebyshevClick = this.handleChebyshevClick.bind(this);
		this.handleEuclidianClick = this.handleEuclidianClick.bind(this);
		this.handleOctileClick = this.handleOctileClick.bind(this);
		this.handleOrthogonalClick = this.handleOrthogonalClick.bind(this);
		this.handleOctolinearClick = this.handleOctolinearClick.bind(this);
		// this.handleDiagonalClick = this.handleDiagonalClick.bind(this);
		this.currentAlgorithmElement = document.getElementById("current-algorithm");
		this.setupEventListeners();
	}
	setupEventListeners() {
		document
			.getElementById("search")
			.addEventListener("click", () => setTimeout(this.handleSearchClick, 0));
		document
			.getElementById("a*-label")
			.addEventListener("click", this.handleAStarClick);
		document
			.getElementById("jps-label")
			.addEventListener("click", this.handleJPSClick);
		document
			.getElementById("bfs-label")
			.addEventListener("click", this.handleGoodBFSClick);
		document
			.getElementById("dijkstra-label")
			.addEventListener("click", this.handleDijkstraClick);
		document
			.getElementById("greedy-label")
			.addEventListener("click", this.handleBestFirstClick);
		document
			.getElementById("clear-walls")
			.addEventListener("click", this.handleClearWalls);
		document
			.getElementById("clear-path")
			.addEventListener("click", this.handleClearPath);

		// document
		// 	.getElementById("svg-label")
		// 	.addEventListener("click", this.handleSVGClick);
		// document
		// 	.getElementById("webgl-label")
		// 	.addEventListener("click", this.handleWebGLClick);
		// document
		// 	.getElementById("canvas-label")
		// 	.addEventListener("click", this.handleCanvasClick);
		document
			.getElementById("chebyshev-label")
			.addEventListener("click", this.handleChebyshevClick);
		document
			.getElementById("manhattan-label")
			.addEventListener("click", this.handleManhattanClick);
		document
			.getElementById("octile-label")
			.addEventListener("click", this.handleOctileClick);
		document
			.getElementById("euclidian-label")
			.addEventListener("click", this.handleEuclidianClick);

		document
			.getElementById("octolinear-label")
			.addEventListener("click", this.handleOctolinearClick);

		document
			.getElementById("orthogonal-label")
			.addEventListener("click", this.handleOrthogonalClick);

		// document
		// 	.getElementById("diagonal-label")
		// 	.addEventListener("click", this.handleDiagonalClick);
	}
	handleOctolinearClick() {
		this.settings.mode = 1;
		this.settings.heuristic = "OCTILE";
		document.getElementById("octile").checked = true;
		document.getElementById("manhattan").checked = false;
		document.getElementById("chebyshev").checked = false;
		document.getElementById("euclidian").checked = false;
	}
	handleOrthogonalClick() {
		this.settings.mode = 0;
		this.settings.heuristic = "MANHATTAN";
		document.getElementById("manhattan").checked = true;
		document.getElementById("octile").checked = false;
		document.getElementById("chebyshev").checked = false;
		document.getElementById("euclidian").checked = false;
	}
	handleDiagonalClick() {
		this.settings.mode = 2;
		this.settings.heuristic = "MANHATTAN";
		document.getElementById("manhattan").checked = true;
		document.getElementById("octile").checked = false;
		document.getElementById("chebyshev").checked = false;
		document.getElementById("euclidian").checked = false;
	}
	handleManhattanClick() {
		this.settings.heuristic = "MANHATTAN";
	}
	handleEuclidianClick() {
		this.settings.heuristic = "EUCLIDEAN";
	}
	handleOctileClick() {
		this.settings.heuristic = "OCTILE";
	}
	handleChebyshevClick() {
		this.settings.heuristic = "CHEBYSHEV";
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
		this.board.disableUI();
		switch (this.settings.algorithm) {
			case "JPS":
				const jps = new JumpPoint(this.board, this.settings);
				jps.start();
				this.setStats(jps.runtime, jps.steps, jps.pathLength);
				break;
			case "A_STAR":
				const aStar = new AStar(this.board, this.settings);
				aStar.start();
				this.setStats(aStar.runtime, aStar.steps, aStar.pathLength);
				break;
			case "DIJKSTRA":
				const dijkstra = new Dijkstra(this.board, this.settings);
				dijkstra.start();
				this.setStats(dijkstra.runtime, dijkstra.steps, dijkstra.pathLength);
				break;
			case "GOOD_BFS":
				const goodBFS = new GoodBFS(this.board, this.settings);
				goodBFS.start();
				this.setStats(goodBFS.runtime, goodBFS.steps, goodBFS.pathLength);
				break;
			case "GREEDY":
				const greedy = new GreedyBestFirst(this.board, this.settings);
				greedy.start();
				this.setStats(greedy.runtime, greedy.steps, greedy.pathLength);
				break;
		}
	}
	setStats(runtime, steps, pathLength) {
		const stats = document.getElementById("stats");
		stats.className = "";
		stats.children[0].innerText = `Runtime: ${runtime.toFixed(2)}ms`;
		stats.children[1].innerText = `Steps: ${steps}`;
		stats.children[2].innerText = `Path Length: ${pathLength}`;
	}
	handleAStarClick() {
		this.currentAlgorithmElement.innerText = "A*";
		this.settings.algorithm = "A_STAR";
	}
	handleJPSClick() {
		this.currentAlgorithmElement.innerText = "Jump-Point Search";
		this.settings.algorithm = "JPS";
		document.getElementById("orthogonal").checked = true;
		document.getElementById("octolinear").checked = false;
		this.handleOrthogonalClick();
	}
	handleGoodBFSClick() {
		this.currentAlgorithmElement.innerText = "Breadth First Search";
		this.settings.algorithm = "GOOD_BFS";
	}
	handleBestFirstClick() {
		this.currentAlgorithmElement.innerText = "Greedy Best-First Search";
		this.settings.algorithm = "GREEDY";
	}
	handleDijkstraClick() {
		this.currentAlgorithmElement.innerText = "Dijkstra";
		this.settings.algorithm = "DIJKSTRA";
	}
	handleClearWalls() {
		const stats = document.getElementById("stats");
		stats.className = "hidden";
		this.board.clearWalls();
	}
	handleClearPath() {
		const stats = document.getElementById("stats");
		stats.className = "hidden";
		this.board.clearPath(false);
	}
}
