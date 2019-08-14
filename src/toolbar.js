export default class Toolbar {
	constructor(settings, startSearch, board) {
        this.board = board;
		this.settings = settings;
		this.startSearch = startSearch;
		this.handleSearchClick = this.handleSearchClick.bind(this);
        this.handleAStarClick = this.handleAStarClick.bind(this);
        this.handleClear = this.handleClear.bind(this);
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
			.getElementById("clear")
			.addEventListener("click", this.handleClear);
	}
	handleSearchClick() {
		this.startSearch();
	}
	handleAStarClick() {
		this.settings.algorithm = 0;
    }
    handleClear(){
        this.board.clear();
    }
}
