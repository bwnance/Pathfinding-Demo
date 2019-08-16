export default class BadBFS {
	constructor(board) {
		this.board = board;
		this.grid = [];
		this.frontier = [];
		this.start = this.start.bind(this);
	}
	arrayContainsArray(array, search) {
		let string_search = JSON.stringify(search);
		string_search = string_search.slice(1, string_search.length - 1);
		const result = Object.keys(array).includes(string_search);
		return result;
	}
	arrayEqualsArray(a1, a2) {
		return JSON.stringify(a1) === JSON.stringify(a2);
	}
	getNeighbors(x, y) {
		let neighbors = [];
		const gridSizeY = this.grid.length - 1;
		// const gridSizeX = this.grid[].length;
		neighbors.push(this.grid[y][x - 1]);
		// if (y > 0) neighbors.push(this.grid[y - 1][x - 1]);
		neighbors.push(this.grid[y][x + 1]);
		// if (y < gridSizeY) neighbors.push(this.grid[y + 1][x + 1]);
		if (y > 1) neighbors.push(this.grid[y - 1][x]);
		if (y < gridSizeY) neighbors.push(this.grid[y + 1][x]);
		// if (y < gridSizeY) neighbors.push(this.grid[y + 1][x - 1]);
		// if (y > 0) neighbors.push(this.grid[y - 1][x + 1]);
		neighbors = neighbors.filter(el => {
			const result =
				el &&
				el.pos[0] >= 0 &&
				!this.arrayContainsArray(this.came_from, el.pos) &&
				el.pos[1] >= 0 &&
				el.objectType != 1 &&
				(el.objectType === 0 || el.objectType === 3);
			return result;
		});
		return neighbors;
	}
	initGrid() {
		this.grid = this.board.grid.map((row, y) => {
			return row.map((el, x) => {
				return {
					pos: [x, y],
					objectType: el.objectType
				};
			});
		});
	}
	start() {
		this.board.clearPath();
		this.initGrid();
		this.frontier = [];
		this.frontier.unshift(this.board.startCoords);
		this.came_from = {};
		this.came_from[this.board.startCoords] = {};
		while (this.frontier.length > 0) {
			const current = this.frontier.pop();
			if (JSON.stringify(current) === JSON.stringify(this.board.targetCoords))
				break;
			setTimeout(() => this.board.colorBox(...current, "#E9D6EC", 4), 0);

			// this.board.deleteBox(...current)
			const neighbors = this.getNeighbors(...current);
			neighbors.forEach(el => {
				this.frontier.unshift(el.pos);
				setTimeout(() => this.board.colorBox(...el.pos, "#409679", 5), 0);
				this.came_from[el.pos] = current;
			});
		}
	}
}
