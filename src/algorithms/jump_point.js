import WeightedGraph from "../structures/weighted_graph";
import PriorityQueue from "../structures/priority_queue";
export default class JumpPoint {
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
			// debugger
			if (current.posKey === this.graph.endNode.posKey) break;
			this.board.addFrontierToQueue(current.x, current.y);
			// current.neighbors.forEach(neighborNode => {
			for(let i = 0; i < current.neighbors.length; i++) {
				const neighborNode = current.neighbors[i];
				
				const { neighbor, moveCost } = neighborNode;
				const jumpResult = this.jump(current, neighbor);

				if (!jumpResult) continue;
				let jumpPoint;
				let secondPoint;
				if (jumpResult instanceof Array) {
					[jumpPoint, secondPoint] = jumpResult;
				}
				else{
					jumpPoint = jumpResult;
				}
				if (jumpPoint.posKey === this.graph.endNode.posKey) {
					this.cameFrom[jumpPoint.posKey] = neighbor;
					this.cameFrom[jumpPoint.posKey] = current;
					this.frontier.enqueue(jumpPoint, -100);

					break;
				}
				let newCost = this.costSoFar[current.posKey] + moveCost; //movement cost 1 for orthoganals, 2 for diagonals
				newCost += this.settings.getHeuristic()(
					[jumpPoint.x, jumpPoint.y],
					[current.x, current.y]
				);
				if (
					!(jumpPoint.posKey in this.costSoFar) ||
					newCost < this.costSoFar[jumpPoint.posKey]
				) {
					this.cameFrom[jumpPoint.posKey] = current;
					this.costSoFar[jumpPoint.posKey] = newCost;
					const priority = this.settings.getHeuristic()(
						[jumpPoint.x, jumpPoint.y],
						this.board.targetCoords
					);
					this.frontier.enqueue(jumpPoint, priority);
					// debugger;
				}

				/////////////////////////////////////////////////
				// debugger;
				if (!secondPoint) continue;
				if (secondPoint.posKey === this.graph.endNode.posKey) {
					this.cameFrom[secondPoint.posKey] = jumpPoint;
					this.frontier.enqueue(secondPoint, -100);
					this.board.addFrontierToQueue(jumpPoint.x, jumpPoint.y);
					break;
				}
				newCost = this.costSoFar[current.posKey] + moveCost; //movement cost 1 for orthoganals, 2 for diagonals
				// debugger
				newCost += this.settings.getHeuristic()(
					[secondPoint.x, secondPoint.y],
					[current.x, current.y]
				);
				if (
					!(secondPoint.posKey in this.costSoFar) ||
					newCost < this.costSoFar[secondPoint.posKey]
				) {
					this.cameFrom[secondPoint.posKey] = jumpPoint;
					this.costSoFar[secondPoint.posKey] = newCost;
					// debugger
					const priority = this.settings.getHeuristic()(
						[secondPoint.x, secondPoint.y],
						this.board.targetCoords
					);
					// debugger;
					this.frontier.enqueue(secondPoint, priority);
				}
				// const { neighbor, moveCost } = neighborNode;
				// const newCost = this.costSoFar[current.posKey] + moveCost; //movement cost 1 for orthoganals, 2 for diagonals
				// if (
				// 	!(neighbor.posKey in this.costSoFar) ||
				// 	newCost < this.costSoFar[neighbor.posKey]
				// ) {
				// 	this.costSoFar[neighbor.posKey] = newCost;
				// 	const priority = newCost + neighbor.endDist;
				// 	this.frontier.enqueue(neighbor, priority);
				// 	this.cameFrom[neighbor.posKey] = current;
				// 	this.board.addNeighborToQueue(neighbor.x, neighbor.y);
				// }
			}
		}
		const endTime = performance.now();
		this.runtime = endTime - startTime;
		this.board.draw();
		// debugger;
		this.drawPath();
	}
	jump(current, target) {
		if (!target) {
			// console.log(current.x, current.y);
			return null;
		}

		const dx = target.x - current.x;
		const dy = target.y - current.y;

		if (!this.graph.isWalkable(target.x, target.y)) {
			return null;
		}
		// this.board.addFrontierToQueue(target.x, target.y);

		if (target.posKey === this.graph.endNode.posKey) return target;
		if (dx != 0) {
			if (
				(this.graph.isWalkable(target.x, target.y - 1) &&
					!this.graph.isWalkable(target.x - dx, target.y - 1)) ||
				(this.graph.isWalkable(target.x, target.y + 1) &&
					!this.graph.isWalkable(target.x - dx, target.y + 1))
			) {
				return target;
			}
			// if (
			// 	this.jump(target.x, target.y, target.x, target.y + 1) ||
			// 	this.jump(target.x, target.y, target.x, target.y - 1)
			// ) {
			// 	console.log("y");
			// 	return target;
			// }
		}
		if (dy != 0) {
			if (
				(this.graph.isWalkable(target.x - 1, target.y) &&
					!this.graph.isWalkable(target.x - 1, target.y - dy)) ||
				(this.graph.isWalkable(target.x + 1, target.y) &&
					!this.graph.isWalkable(target.x + 1, target.y - dy))
			) {
				return target;
			}

			const rightResult = this.jump(
				target,
				this.graph.getNode(target.x + 1, target.y)
			);
			if (rightResult) {
				return [target, rightResult];
			}
			const leftResult = this.jump(
				target,
				this.graph.getNode(target.x - 1, target.y)
			);

			if (leftResult) {
				return [target, leftResult];
			}
			// if (
			// 	rightResult || leftResult
			// ) {
			// 	console.log("y");
			// 	return target;
			// }
		}
		let nextPos = this.jump(
			target,
			this.graph.getNode(target.x + dx, target.y + dy)
		);
		return nextPos;
	}
}
