import Graph from "../structures/graph";
import Queue from "../structures/queue";
export default class GoodBFS {
	constructor(board, settings) {
		this.board = board;
		this.graph;
		this.settings = settings;
		this.grid = [];
		this.cameFrom;
		this.frontier = new Queue();
		this.start = this.start.bind(this);
		this.recursiveStep = this.recursiveStep.bind(this);
		this.startRecursive = this.startRecursive.bind(this);
		this.drawPath = this.drawPath.bind(this);
	}
	initializeGraph() {
		this.graph = new Graph(this.board, this.settings);
	}

	recursiveStep() {
		if (this.frontier.isEmpty()) {
			return;
		}
		const current = this.frontier.dequeue();
		if (current.posKey === this.graph.endNode.posKey) {
			setTimeout(() => this.drawPath());
			return;
		}
		this.board.colorFrontier(current.x, current.y);
		current.neighbors.forEach(neighbor => {
			if (!(neighbor.posKey in this.cameFrom)) {
				this.frontier.enqueue(neighbor);
				this.cameFrom[neighbor.posKey] = current;
				this.board.colorNeighbor(neighbor.x, neighbor.y);
			}
		});
		this.recursiveStep();
	}
	drawPath() {
		let current = this.graph.endNode;
		if (!current) return;

		const path = [];
		while (current.posKey !== this.graph.startNode.posKey) {
			path.push(current);
			current = this.cameFrom[current.posKey];
			if (!current) {
				path.shift();
				return;
			}
		}
		path.push(this.graph.startNode);
		const reversed = path.reverse();
		this.pathLength = path.length;
		this.board.path = reversed;
	}
	startRecursive() {
		this.initializeGraph();
		this.board.clearPath();
		this.frontier = new Queue();
		this.frontier.enqueue(this.graph.startNode);
		this.cameFrom = {};
		this.cameFrom[this.graph.startNode.posKey] = null;
		setTimeout(this.recursiveStep);
	}
	start() {
		this.initializeGraph();
		this.board.clearPath();
		const startTime = performance.now();
		this.steps = 0;
		this.frontier = new Queue();
		this.frontier.enqueue(this.graph.startNode);
		this.cameFrom = {};
		this.cameFrom[this.graph.startNode.posKey] = null;
		while (!this.frontier.isEmpty()) {
			this.steps += 1;
			const current = this.frontier.dequeue();
			if (current.posKey === this.graph.endNode.posKey) break;
			this.board.addFrontierToQueue(current.x, current.y);
			current.neighbors.forEach(neighbor => {
				if (!(neighbor.posKey in this.cameFrom)) {
					this.frontier.enqueue(neighbor);
					this.cameFrom[neighbor.posKey] = current;
					this.board.addNeighborToQueue(neighbor.x, neighbor.y);
				}
			});
		}
		const endTime = performance.now();
		this.runtime = endTime - startTime;
		this.board.draw();

		this.drawPath();
	}
}
