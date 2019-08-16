import WeightedGraph from "../structures/weighted_graph";
import PriorityQueue from "../structures/priority_queue";
export default class Dijkstra {
	constructor(board, settings) {
		this.board = board;
		this.graph;
		this.settings = settings;
		this.grid = [];
        this.came_from;
        this.cost_so_far;
		this.frontier = new PriorityQueue();
		this.start = this.start.bind(this);
		this.recursiveStep = this.recursiveStep.bind(this);
		this.startRecursive = this.startRecursive.bind(this);
		this.drawPath = this.drawPath.bind(this);
	}
	initializeGraph() {
		this.graph = new WeightedGraph(this.board, this.settings);
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
		this.frontier.enqueue(this.graph.startNode, 0);
		this.came_from = {};
		this.cost_so_far = {};
		this.came_from[this.graph.startNode.posKey] = null;
		this.cost_so_far[this.graph.startNode.posKey] = 0;
		setTimeout(this.recursiveStep);
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
			const new_cost = this.cost_so_far[current.posKey]; // would actually be cost between current and neighbor
			if (
				!Object.keys(this.cost_so_far).includes(neighbor.posKey) ||
				new_cost < this.cost_so_far[neighbor.posKey]
			) {
				this.cost_so_far[neighbor.posKey] = new_cost;
				const priority = new_cost;
				this.frontier.enqueue(neighbor, priority);
				this.came_from[neighbor.posKey] = current;
				setTimeout(() =>
					this.board.colorBox(neighbor.x, neighbor.y, "#409679", 5)
				);
			}
		});
		this.recursiveStep();
	}
	start() {
		this.initializeGraph();
		this.board.clearPath();
		this.frontier = new PriorityQueue();
		this.frontier.enqueue(this.graph.startNode, 0);
		const came_from = {};
		const cost_so_far = {};
		came_from[this.graph.startNode.posKey] = null;
		cost_so_far[this.graph.startNode.posKey] = 0;

		while (!this.frontier.isEmpty()) {
			const current = this.frontier.dequeue();
			if (current.posKey === this.graph.endNode.posKey) break;
			setTimeout(() => this.board.colorBox(current.x, current.y, "#E9D6EC", 4));
			// setTimeout(() => this.board.colorBox(current.x, current.y, "#E9D6EC", 4));
			current.neighbors.forEach(neighbor => {
				const new_cost = cost_so_far[current.posKey]; // would actually be cost between current and neighbor
				// if (!Object.keys(came_from).includes(neighbor.posKey)) {
				if (
					!Object.keys(cost_so_far).includes(neighbor.posKey) ||
					new_cost < cost_so_far[neighbor.posKey]
				) {
					cost_so_far[neighbor.posKey] = new_cost;
					const priority = new_cost;
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
