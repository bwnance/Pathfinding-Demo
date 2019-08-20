import WeightedGraph from "../structures/weighted_graph";
import PriorityQueue from "../structures/priority_queue";
export default class AStar {
	constructor(board, settings) {
		this.board = board;
		this.graph;
		this.settings = settings;
		this.grid = [];
		this.cameFrom;
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
		this.frontier = new PriorityQueue();
		this.frontier.enqueue(this.graph.startNode, 0);
		this.costSoFar = {};
		this.cameFrom = {};
		this.costSoFar[this.graph.startNode.posKey] = 0;
		this.cameFrom[this.graph.startNode.posKey] = null;
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
		this.board.colorFrontier(current.x, current.y);
		current.neighbors.forEach(neighbor => {
			const newCost = this.costSoFar[current.posKey] + 1; //movement cost is always 1
			if (
				!(neighbor.posKey in this.costSoFar) ||
				newCost < this.costSoFar[neighbor.posKey]
			) {
				this.costSoFar[neighbor.posKey] = newCost;
				const priority = newCost + neighbor.endDist;
				this.frontier.enqueue(neighbor, priority);
				this.cameFrom[neighbor.posKey] = current;

				this.board.colorNeighbor(neighbor.x, neighbor.y);
			}
		});
		this.recursiveStep();
	}
	start() {
		this.initializeGraph();
		this.board.clearPath();
		const startTime = performance.now();
		this.frontier = new PriorityQueue();
		this.frontier.enqueue(this.graph.startNode, 0);
		this.steps = 0;
		this.costSoFar = {};
		this.cameFrom = {};
		this.costSoFar[this.graph.startNode.posKey] = 0;
		this.cameFrom[this.graph.startNode.posKey] = null;
		while (!this.frontier.isEmpty()) {
			this.steps += 1;
			const current = this.frontier.dequeue();
			if (current.posKey === this.graph.endNode.posKey) break;
			this.board.addFrontierToQueue(current.x, current.y);
			current.neighbors.forEach(neighborNode => {
				const { neighbor, moveCost } = neighborNode;
				const newCost = this.costSoFar[current.posKey] + moveCost; //movement cost 1 for orthoganals, 2 for diagonals
				if (
					!(neighbor.posKey in this.costSoFar) ||
					newCost < this.costSoFar[neighbor.posKey]
				) {
					this.costSoFar[neighbor.posKey] = newCost;
					const priority = newCost + neighbor.endDist;
					this.frontier.enqueue(neighbor, priority);
					this.cameFrom[neighbor.posKey] = current;
					this.board.addNeighborToQueue(neighbor.x, neighbor.y);
					// setTimeout(() =>
					// 	this.board.makeText(
					// 		neighbor.x,
					// 		neighbor.y,
					// 		(newCost + neighbor.endDist).toFixed(2)
					// 	)
					// );
				}
			});
		}
		const endTime = performance.now();
		this.runtime = endTime - startTime;
		this.board.draw();
		this.drawPath();
	}
}
