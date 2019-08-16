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
		this.handleGreedyBestFirstClick = this.handleGreedyBestFirstClick.bind(this);
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
		switch (this.settings.algorithm) {
			case "A_STAR":
				const aStar = new AStar(this.board, this.settings);
				aStar.startRecursive();
				break;
			case "DIJKSTRA":
				const dijkstra = new Dijkstra(this.board, this.settings);
				dijkstra.startRecursive();
				break;
			case "GOOD_BFS":
				const goodBFS = new GoodBFS(this.board, this.settings);
				goodBFS.startRecursive();
				break;
			case "GREEDY":
				const greedy = new GreedyBestFirst(this.board, this.settings);
				greedy.startRecursive();
				break;
		}
	}
	handleAStarClick() {
		this.currentAlgorithmElement.innerText = "A* Algorithm";
		this.settings.algorithm = "A_STAR";
	}
	handleBadBFSClick() {
		this.settings.algorithm = "BAD_BFS";
	}
	handleGoodBFSClick() {
		this.currentAlgorithmElement.innerText =
			"Good Breadth First Search Algorithm";
		this.settings.algorithm = "GOOD_BFS";
	}
	handleGreedyBestFirstClick() {
		this.currentAlgorithmElement.innerText =
			"Greedy Best-First Search Algorithm";
		this.settings.algorithm = "GREEDY";
	}
	handleDijkstraClick() {
		this.currentAlgorithmElement.innerText = "Dijkstra's Algorithm";
		this.settings.algorithm = "DIJKSTRA";
	}
	handleClearWalls() {
		this.board.clearWalls();
	}
	handleClearPath() {
		this.board.clearPath();
	}
}
