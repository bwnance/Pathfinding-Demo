import WeightedGraph from "../structures/weighted_graph";
import PriorityQueue from "../structures/priority_queue";
export default class GreedyBestFirst {
	constructor(board, settings) {
		this.board = board;
		this.graph;
		this.settings = settings;
		this.grid = [];
		this.cameFrom;
		this.frontier = new PriorityQueue();
		this.start = this.start.bind(this);
		this.recursiveStep = this.recursiveStep.bind(this);
		this.startRecursive = this.startRecursive.bind(this);
		this.drawPath = this.drawPath.bind(this);
	}
	initializeGraph() {
		this.graph = new WeightedGraph(this.board, this.settings);
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
			if (!Object.keys(this.cameFrom).includes(neighbor.posKey)) {
				const priority = neighbor.endDist;
				this.frontier.enqueue(neighbor, priority);
				this.cameFrom[neighbor.posKey] = current;
				this.board.colorNeighbor(neighbor.x, neighbor.y);

				// setTimeout(() =>
				// 	this.board.makeText(current.x, current.y, current.endDist)
				// );
			}
		});
		this.recursiveStep();
	}
	drawPath() {
		let current = this.graph.endNode;

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
		let prev = path.shift();

		reversed.forEach(el => {
			// setTimeout(() => this.board.colorBox(el.x, el.y, "black", 4));
			const prevCoords = [prev.x, prev.y];
			setTimeout(() =>
				this.board.createLine(prevCoords, [el.x, el.y], "black", 4)
			);
			prev = el;
		});
	}
	startRecursive() {
		this.initializeGraph();
		this.board.clearPath();
		this.frontier = new PriorityQueue();
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
		this.frontier = new PriorityQueue();
		this.frontier.enqueue(this.graph.startNode);
		this.cameFrom = {};
		this.cameFrom[this.graph.startNode.posKey] = null;
		while (!this.frontier.isEmpty()) {
			this.steps += 1;
			const current = this.frontier.dequeue();
			if (current.posKey === this.graph.endNode.posKey) break;
			this.board.colorFrontier(current.x, current.y);
			current.neighbors.forEach(neighbor => {
				if (!Object.keys(this.cameFrom).includes(neighbor.posKey)) {
					const priority = neighbor.endDist;
					this.frontier.enqueue(neighbor, priority);
					this.cameFrom[neighbor.posKey] = current;
					this.board.colorNeighbor(neighbor.x, neighbor.y);
				}
			});
		}
		const endTime = performance.now();
		this.runtime = endTime - startTime;
		this.drawPath();
	}
}
