import BadBFS from "./algorithms/bad_bfs";
import GoodBFS from "./algorithms/good_bfs";
import Dijkstra from "./algorithms/dijkstra";
import GreedyBestFirst from "./algorithms/greedy_best_first";
import AStar from "./algorithms/a_star";
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
	}
	handleSearchClick() {
		const radioParent = document.getElementsByClassName("radios")[0];
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
				this.setStats(aStar.runtime, aStar.steps)
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
		document.getElementById("stats").children[0].innerText = `Runtime: ${runtime.toFixed(2)}ms`
		document.getElementById("stats").children[1].innerText = `Steps: ${steps}`
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
