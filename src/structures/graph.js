export default class Graph {
	constructor(board, settings) {
        this.settings = settings
		this.nodes = {};
		this.aMatrix = [];
		this.board = board;
		this.grid = board.grid;
		this.populateFromGrid(this.grid);
	}
	populateFromGrid(grid) {
		grid.forEach((row, y) => {
			row.forEach((el, x) => {
				const node = new GraphNode(el.objectType, [x, y]);
				this.nodes[`${x},${y}`] = node;
				if (el.objectType === 2) this.startNode = node;
				else if (el.objectType === 3) this.endNode = node;
			});
		});
		Object.values(this.nodes).forEach(node => {
			node.neighbors = this.neighbors(node);
		});
	}
	neighbors(node) {
		const neighbors = [];
		const horVertDirs = [[0, 1], [1, 0], [-1, 0], [0, -1]];
		const diagDirs = [[1, 1], [-1, -1], [-1, 1], [1, -1]];
		let dirs;
		switch (this.settings.mode) {
			case 0:
				dirs = horVertDirs;
				break;
			case 1:
				dirs = horVertDirs.concat(diagDirs);
				break;
			case 2:
				dirs = diagDirs;
				break;
		}
		dirs.forEach(dir => {
			const newDir = { x: node.x + dir[0], y: node.y + dir[1] };
			if (
				newDir.x < 1 ||
				newDir.y < 1 ||
				newDir.x >= this.grid[1].length ||
				newDir.y >= this.grid.length
			)
				return;
			const neighbor = this.nodes[`${newDir.x},${newDir.y}`];
			if (neighbor.objectType === 1) return;
			if ((dir[0] === -1 && dir[1] === -1) || (dir[0] === 1 && dir[1] === 1)) {
				const testDir1 = { x: newDir.x - dir[1], y: newDir.y };
				const testDir2 = { x: newDir.x, y: newDir.y - dir[1] };
				const testNode1 = this.nodes[`${testDir1.x},${testDir1.y}`];
				const testNode2 = this.nodes[`${testDir2.x},${testDir2.y}`];
				if (testNode1.objectType === 1 || testNode2.objectType === 1) return;
			} else if (
				(dir[0] === -1 && dir[1] === 1) ||
				(dir[0] === 1 && dir[1] === -1)
			) {
				const testDir1 = { x: newDir.x + dir[1], y: newDir.y };
				const testDir2 = { x: newDir.x, y: newDir.y + dir[0] };
				const testNode1 = this.nodes[`${testDir1.x},${testDir1.y}`];
				const testNode2 = this.nodes[`${testDir2.x},${testDir2.y}`];
				if (testNode1.objectType === 1 || testNode2.objectType === 1) return;
			}
			neighbors.push(neighbor);
		});
		return neighbors;
	}
}
class GraphNode {
	constructor(oType, [x, y]) {
		this.cost = 1;
		this.objectType = oType;
		this.posKey = `${x},${y}`;
		this.x = x;
		this.y = y;
		this.neighbors = [];
	}
}
