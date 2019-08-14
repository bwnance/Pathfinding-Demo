import BadBFS from "./algorithms/bad_bfs";
import GoodBFS from "./algorithms/good_bfs";
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
		this.setupEventListeners();
	}
	setupEventListeners() {
		document
			.getElementById("search")
			.addEventListener("click", () => setTimeout(this.handleSearchClick, 0));
		// document
		// 	.getElementById("a*")
		// 	.addEventListener("click", this.handleAStarClick);
		// document
		// 	.getElementById("bad-bfs")
		// 	.addEventListener("click", this.handleBadBFSClick);
		document
			.getElementById("good-bfs")
			.addEventListener("click", this.handleGoodBFSClick);
		document
			.getElementById("clear-walls")
			.addEventListener("click", this.handleClearWalls);
		document
			.getElementById("clear-path")
			.addEventListener("click", this.handleClearPath);
	}
	handleSearchClick() {
		switch (this.settings.algorithm) {
			case "BAD_BFS":
				const badBFS = new BadBFS(this.board);
				badBFS.start();
				break;
			case "GOOD_BFS":
				const goodBFS = new GoodBFS(this.board, this.settings);
				goodBFS.startRecursive();
				break;
		}
	}
	handleAStarClick() {
		this.settings.algorithm = "A_STAR";
	}
	handleBadBFSClick() {
		this.settings.algorithm = "BAD_BFS";
	}
	handleGoodBFSClick() {
		this.settings.algorithm = "GOOD_BFS";
	}
	handleClearWalls() {
		this.board.clearWalls();
	}
	handleClearPath() {
		this.board.clearPath();
	}
}
