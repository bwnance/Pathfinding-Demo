export default class Toolbar {
	constructor(settings, startSearch, board) {
        this.board = board;
		this.settings = settings;
		this.startSearch = startSearch;
		this.handleSearchClick = this.handleSearchClick.bind(this);
        this.handleAStarClick = this.handleAStarClick.bind(this);
        this.handleClearWalls = this.handleClearWalls.bind(this);
        this.handleClearPath = this.handleClearPath.bind(this);
		this.setupEventListeners();
	}
	setupEventListeners() {
		document
			.getElementById("search")
			.addEventListener("click", ()=> setTimeout(this.handleSearchClick, 0));
		document
			.getElementById("a*")
			.addEventListener("click", this.handleAStarClick);
		document
			.getElementById("clear-walls")
			.addEventListener("click", this.handleClearWalls);
		document
			.getElementById("clear-path")
			.addEventListener("click", this.handleClearPath);
	}
	handleSearchClick() {
		this.startSearch();
	}
	handleAStarClick() {
		this.settings.algorithm = 0;
    }
    handleClearWalls(){
        this.board.clearWalls();
    }
    handleClearPath(){
        this.board.clearPath();
    }
}
