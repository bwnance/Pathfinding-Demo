import WeightedGraph from "../structures/weighted_graph";
import PriorityQueue from "../structures/priority_queue";
export default class GreedyBestFirst {
	constructor(board, settings) {
		this.board = board;
		this.graph;
		this.settings = settings;
		this.grid = [];
		this.came_from;
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
		setTimeout(() => this.board.colorBox(current.x, current.y, "#E9D6EC", 4));
		current.neighbors.forEach(neighbor => {
			if (!Object.keys(this.came_from).includes(neighbor.posKey)) {
				const priority = neighbor.endDist;
				this.frontier.enqueue(neighbor, priority);
				this.came_from[neighbor.posKey] = current;
				setTimeout(() =>
					this.board.colorBox(neighbor.x, neighbor.y, "#409679", 5)
				);
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
			current = this.came_from[current.posKey];
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
		this.came_from = {};
		this.came_from[this.graph.startNode.posKey] = null;
		setTimeout(this.recursiveStep);
	}
	start() {
		this.initializeGraph();
		this.board.clearPath();
		this.frontier = new PriorityQueue();
		this.frontier.enqueue(this.graph.startNode);
		const came_from = {};
		came_from[this.graph.startNode.posKey] = null;
		while (!this.frontier.isEmpty()) {
			const current = this.frontier.dequeue();
			if (current.posKey === this.graph.endNode.posKey) break;
			setTimeout(() => this.board.colorBox(current.x, current.y, "#E9D6EC", 4));
			current.neighbors.forEach(neighbor => {
				if (!Object.keys(came_from).includes(neighbor.posKey)) {
					const priority = neighbor.cost;
					this.frontier.enqueue(neighbor, priority);
					came_from[neighbor.posKey] = current;
					setTimeout(() =>
						this.board.colorBox(neighbor.x, neighbor.y, "#409679", 5)
					);
				}
			});
		}
	}
}
