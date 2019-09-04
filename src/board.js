import Queue from "./structures/queue";
import Two from "two.js";
export default class Board {
	constructor() {
		this.grid = [];
		this.twoFg;
		this.twoBg;
		this.boxSize = 30;
		this.rootEl = document.getElementById("demo-container");
		this.parentEl = document.getElementById("render-section");
		this.bgEl = document.getElementById("background");
		this.squaresUl = document.getElementById("squares");
		this.fgEl = document.getElementById("foreground");
		this.setup();
		this.startCoords;
		this.targetCoords;
		this.lines = [];
		this.carryingStart = false;
		this.carryingEnd = false;
		this.deleting = false;
		this.building = false;
		this.lastCoords = [];
		this.texts = [];
		this.saved = {};
		this.backgroundColor = "#353535";
		this.drawQueue = new Queue();
		this.recursionQueue = new Queue();
		this.currentDrawSection = {};
		this._draw = this._draw.bind(this);
		this._draw_recursion = this._draw_recursion.bind(this);
		this.drawnSquares = {};
		this.running = false;
	}
	setup() {
		this.setupCanvases();
		this.addListeners();
	}

	setupBG() {
		this.twoBg = new Two(this.params).appendTo(this.bgEl);
		this.setupGrid();
		this.twoBg.update();
	}
	createPath(args) {
		const anchors = [];
		args.forEach(pair => {
			const anchor = new Two.Anchor(pair[0], pair[1]);
			anchors.push(anchor);
		});
		const path = this.twoFg.makePath(anchors, true);
		path.stroke = "black";
		path.linewidth = 10;
		this.twoFg.update();
	}
	createLine(c1, c2, color, thickness) {
		const [xPos1, yPos1] = this.convertCoordinates(...c1);
		const [xPos2, yPos2] = this.convertCoordinates(...c2);
		const line = this.twoFg.makeLine(xPos1, yPos1, xPos2, yPos2);
		line.stroke = color;
		line.linewidth = thickness;
		line.cap = "round";
		line.miter = "round";
		line.join = "round";
		line.fill = "black";
		this.lines.push(line);
		this.twoFg.update();
	}
	sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}
	drawPath() {
		let prev = this.path.shift();

		// this.path.forEach(el => {
		for (let i = 0; i < this.path.length; i++) {
			const el = this.path[i];
			// setTimeout(() => this.board.colorBox(el.x, el.y, "black", 4));
			const prevCoords = [prev.x, prev.y];
			setTimeout(
				() => this.createLine(prevCoords, [el.x, el.y], "black", 4),
				0
			);

			prev = el;
		}
	}
	enableUI(){
		this.running = false;
		document.getElementById('search').disabled = false;
		document.getElementById("clear-walls").disabled = false;
		document.getElementById("clear-path").disabled = false;
	}
	disableUI(){
		this.running = true;
		document.getElementById("search").disabled = true;
		document.getElementById("clear-walls").disabled = true;
		document.getElementById("clear-path").disabled = true;
	}
	draw() {
		this.drawQueue.enqueue(Object.assign({}, this.currentDrawSection));
		const that = this
		setTimeout(() => {
			that._draw_recursion();
		});
	}
	_draw_recursion() {
		const square = this.recursionQueue.dequeue();
		if (square === undefined) {
			this.recursionQueue = new Queue();
			this.drawnSquares = {};
			this._draw();
			return;
		}
		if (square in this.drawnSquares) {
			this._draw_recursion();
		} else {
			this.colorRecursion(...square);
			this.drawnSquares[square] = true;
			this.sleep(1).then(this._draw_recursion);
		}
	}
	_draw() {
		let section = this.drawQueue.dequeue();
		if (section === undefined) {
			this.currentDrawSection = {};
			this.drawPath();
			this.enableUI();
			return;
		}
		this.colorFrontier(...section.frontier);
		section.neighbors.forEach(neighbor => {
			this.colorNeighbor(...neighbor);
		});

		// section = this.drawQueue.dequeue();
		this.sleep(3).then(this._draw);
	}
	addFrontierToQueue(x, y) {
		if (Object.keys(this.currentDrawSection).length !== 0)
			this.drawQueue.enqueue(Object.assign({}, this.currentDrawSection));
		this.currentDrawSection = {
			frontier: [x, y],
			neighbors: [],
			recursion: []
		};
		// setTimeout(() => this.colorBox(x, y, "#E9D6EC", 4), 10);
	}
	addNeighborToQueue(x, y) {
		this.currentDrawSection.neighbors.push([x, y]);
		// setTimeout(() => this.colorBox(x, y, "#79C6AD", 5), 10);
	}
	addRecursionToQueue(x, y) {
		this.recursionQueue.enqueue([x, y]);
		// setTimeout(() => this.colorBox(x, y, "#79C6AD", 5), 10);
	}
	colorFrontier(x, y, timeout = 0) {
		setTimeout(() => this.colorBox(x, y, "#E9D6EC", 4), timeout);
	}
	colorNeighbor(x, y, timeout = 0) {
		setTimeout(() => this.colorBox(x, y, "#79C6AD", 5), timeout);
	}
	colorRecursion(x, y, timeout = 0) {
		setTimeout(() => this.colorBox(x, y, "#3f4f45", 10), timeout);
	}
	colorBox(x, y, color, objectType = 1, override = false) {
		const stringCoords = JSON.stringify([x, y]);
		if (
			!override &&
			(stringCoords === JSON.stringify(this.targetCoords) ||
				stringCoords === JSON.stringify(this.startCoords))
		)
			return;
		if (this.grid[y][x].box) {
			this.grid[y][x].box.style.backgroundColor = color;
			this.grid[y][x].objectType = objectType;
		} else {
			this.createBox(this.twoFg, x, y, color, true, objectType);
		}
		// this.twoFg.update();
	}
	makeText(x, y, message) {
		// const text = new Two.Text(message, x, y);
		// const translation = new Two.Vector(x, y);
		// text.translation = translation;
		// this.twoFg.add(text);
		const [xPos, yPos] = this.convertCoordinates(x, y);
		const posKey = JSON.stringify([xPos, yPos]);
		if (this.texts[posKey]) {
			if (parseInt(this.texts[posKey]) < parseInt(message)) {
				this.twoFg.remove(this.texts[posKey]);
				const text = this.twoFg.makeText(message, xPos, yPos);
				text.size = 4;
				this.texts[posKey] = text;
			}
		} else {
			const text = this.twoFg.makeText(message, xPos, yPos);
			text.size = 10;
			this.texts[posKey] = text;
		}
	}
	createBox(context, x, y, color, saveBox = false, objectType = 0) {
		// const [xPos, yPos] = this.convertCoordinates(x, y);
		// let box = context.makeRectangle(xPos, yPos, this.boxSize, this.boxSize);
		// let dot = context.makeCircle(xPos, yPos, 5);
		// box.stroke = "rgb(180,180,180)";
		// box.fill = color;

		const li = document.createElement("li");
		li.style.backgroundColor = "#353535";
		li.style.height = this.boxSize;
		li.style.width = this.boxSize;
		document.getElementsByClassName(`row-${y}`)[0].appendChild(li);
		this.grid[y][x] = {
			box: li,
			objectType: objectType,
			boxInfo: {
				x,
				y,
				width: this.boxSize,
				height: this.boxSize
			}
		};
	}
	clearPath(fromAlgo = true) {
		this.saved = {};
		Object.values(this.texts).forEach(text => {
			this.twoFg.remove(text);
		});
		this.texts = {};
		// this.twoFg.clear();
		this.lines.forEach(line => {
			this.twoFg.remove(line);
		});
		this.lines = [];
		this.path = [];
		this.grid.forEach((row, y) => {
			row.forEach((el, x) => {
				if (el.objectType === 1) return;
				this.deleteBox(x, y);
				el.objectType = 0;
			});
		});
		this.setStart(...this.startCoords);
		this.setTarget(...this.targetCoords);
		if (fromAlgo) {
			this.saved[JSON.stringify(this.startCoords)] = { objectType: 4 };
			this.saved[JSON.stringify(this.targetCoords)] = { objectType: 4 };
		}
		this.twoFg.update();
	}
	clearWalls() {
		this.saved = {};
		Object.values(this.texts).forEach(text => {
			this.twoFg.remove(text);
		});
		this.texts = {};
		this.lines.forEach(line => {
			this.twoFg.remove(line);
		});
		this.lines = [];
		// this.twoFg.clear();
		this.grid.forEach((row, y) => {
			row.forEach((el, x) => {
				this.deleteBox(x, y);
				el.objectType = 0;
				// if (el.box) this.twoFg.remove(el.box);
			});
		});
		this.setStart(...this.startCoords);
		this.setTarget(...this.targetCoords);
		this.twoFg.update();
	}
	convertCoordinates(x, y) {
		const xPos = x * this.boxSize - this.boxSize / 2;
		const yPos = y * this.boxSize - this.boxSize / 2;
		return [xPos, yPos];
	}
	convertFromScreenCoords(sx, sy) {
		const x = Math.floor(sx / this.boxSize) + 1;
		const y = Math.floor(sy / this.boxSize) + 1;
		return [x, y];
	}
	safeDeleteBox(x, y) {
		const el = this.grid[y][x];
		if (el.objectType === 1) {
			this.deleteBox(x, y);
		}
	}
	deleteBox(x, y) {
		const el = this.grid[y][x];
		el.objectType = 0;
		el.box.style.backgroundColor = this.backgroundColor;
		// el.box = null;
		// this.twoFg.update();
	}
	setupGrid() {
		this.saved = {};
		this.removeAllSquares();
		const numLinesY = this.params.height / this.boxSize;
		const numLinesX = this.params.width / this.boxSize;
		for (let y = 1; y <= numLinesY; y++) {
			this.grid[y] = [];
			const div = document.createElement("div");
			div.className = `row-${y}`;
			this.squaresUl.appendChild(div);
			for (let x = 1; x <= numLinesX; x++) {
				this.createBox(this.twoBg, x, y, this.backgroundColor);
			}
		}
	}
	removeAllSquares() {
		while (this.squaresUl.firstChild) {
			this.squaresUl.removeChild(this.squaresUl.firstChild);
		}
	}
	setupFG() {
		this.twoFg = new Two(this.params).appendTo(this.fgEl);
		this.setStart(10, 10);
		this.setTarget(17, 10);
		this.twoFg.update();
	}
	destroyFG() {
		this.fgEl.removeChild(this.fgEl.children[1]);
		this.setupGrid();
	}
	setupCanvases() {
		const height =
			this.boxSize +
			Math.floor(this.parentEl.offsetHeight / this.boxSize) * this.boxSize;

		const width =
			this.boxSize +
			Math.floor(this.parentEl.offsetWidth / this.boxSize) * this.boxSize;

		this.params = {
			width: width,
			height: height,
			type: Two.Types.svg
		};
		this.setupBG();
		this.setupFG();
	}
	clearEnd() {
		const savedBox = this.saved[JSON.stringify(this.targetCoords)];
		const [px, py] = this.targetCoords;
		if (savedBox) {
			if (savedBox.objectType === 4) {
				this.colorFrontier(px, py);
			} else if (savedBox.objectType === 5) {
				this.colorNeighbor(px, py);
			} else if (savedBox.objectType === 10) {
				this.colorRecursion(px, py);
			}
			// delete this.saved[JSON.stringify(this.targetCoords)];
		} else {
			this.deleteBox(...this.targetCoords);
		}
	}
	clearStart() {
		const savedBox = this.saved[JSON.stringify(this.startCoords)];
		const [px, py] = this.startCoords;
		// console.log(savedBox);
		if (savedBox) {
			if (savedBox.objectType === 4) {
				this.colorFrontier(px, py);
			} else if (savedBox.objectType === 5) {
				this.colorNeighbor(px, py);
			} else if (savedBox.objectType === 10) {
				this.colorRecursion(px, py);
			}
			// delete this.saved[JSON.stringify(this.startCoords)];
		} else {
			this.deleteBox(...this.startCoords);
		}
	}
	setStart(x, y) {
		this.colorBox(x, y, "#80BBF7", 2, true);
		this.startCoords = [x, y];
	}
	setTarget(x, y) {
		this.colorBox(x, y, "#A31621", 3, true);
		this.targetCoords = [x, y];
	}
	addListeners() {
		this.rootEl.addEventListener("mousemove", this.handleMouseMove.bind(this));
		this.parentEl.addEventListener(
			"mousedown",
			this.handleMouseDown.bind(this)
		);
		this.rootEl.addEventListener("mouseup", this.handleMouseUp.bind(this));
		this.parentEl.addEventListener(
			"mouseleave",
			this.handleMouseLeave.bind(this)
		);
	}
	handleMouseLeave(e) {
		// this.carryingStart = false;
		// this.building = false;
		// this.carryingEnd = false;
		// this.deleting = false;
	}
	handleMouseUp(e) {
		if (this.running) return;

		const x = Math.floor(e.layerX / this.boxSize) + 1;
		const y = Math.floor(e.layerY / this.boxSize) + 1;
		if (this.carryingStart) {
			this.carryingStart = false;
		}
		if (this.carryingEnd) {
			this.carryingEnd = false;
		}
		if (this.building) {
			this.building = false;
		}
		if (this.deleting) {
			this.deleting = false;
		}
	}
	handleMouseDown(e) {
		if(this.running) return;
		const x = Math.floor(e.layerX / this.boxSize) + 1;
		const y = Math.floor(e.layerY / this.boxSize) + 1;
		if (!this.grid[y] || !this.grid[y][x]) return;
		if (this.grid[y][x].objectType === 2) {
			this.carryingStart = true;
			return;
		}
		if (this.grid[y][x].objectType === 3) {
			this.carryingEnd = true;
			return;
		}
		if (this.grid[y][x].objectType !== 1) {
			const currentBox = this.grid[y][x];
			if (
				currentBox.objectType === 4 ||
				currentBox.objectType === 5 ||
				currentBox.objectType === 10
			) {
				const realCoords = [currentBox.boxInfo.x, currentBox.boxInfo.y];

				this.saved[JSON.stringify(realCoords)] = Object.assign({}, currentBox);
			}
			this.building = true;
			this.colorBox(x, y, "rgb(150, 150, 150)", 1);
			return;
		}
		if (this.grid[y][x].objectType === 1) {
			this.deleting = true;
			const savedBox = this.saved[JSON.stringify([x, y])];
			if (savedBox) {
				if (savedBox.objectType === 4) {
					this.colorFrontier(x, y);
				} else if (savedBox.objectType === 5) {
					this.colorNeighbor(x, y);
				} else if (savedBox.objectType === 10) {
					this.colorRecursion(x, y);
				}
				delete this.saved[JSON.stringify([x, y])];
			} else {
				this.deleteBox(x, y);
			}
			return;
		}
	}
	handleMouseMove(e) {
		// debugger
		if (this.running) return;
		const x = Math.floor(e.pageX / this.boxSize) + 1;
		const y = Math.floor(e.pageY / this.boxSize) + 1;
		if (!this.grid[y] || !this.grid[y][x]) return;
		if (JSON.stringify(this.lastCoords) === JSON.stringify([x, y])) return;
		const currentBox = this.grid[y][x];
		if (
			currentBox.objectType === 4 ||
			currentBox.objectType === 5 ||
			currentBox.objectType === 10
		) {
			const realCoords = [currentBox.boxInfo.x, currentBox.boxInfo.y];
			this.saved[JSON.stringify(realCoords)] = Object.assign({}, currentBox);
		}
		if (this.carryingEnd) {
			if (currentBox.objectType !== 2 && currentBox.objectType !== 1) {
				this.clearEnd();
				this.setTarget(x, y);
			}
			// return;
		}
		if (this.carryingStart) {
			if (currentBox.objectType !== 3 && currentBox.objectType !== 1) {
				this.clearStart();
				this.setStart(x, y);
			}
			// return;
		}
		if (this.building) {
			this.colorBox(x, y, "rgb(150, 150, 150)", 1);
			// this.restoreSaved();

			// return;
		}
		if (this.deleting) {
			const savedBox = this.saved[JSON.stringify([x, y])];
			if (savedBox) {
				if (savedBox.objectType === 4) {
					this.colorFrontier(x, y);
				} else if (savedBox.objectType === 5) {
					this.colorNeighbor(x, y);
				} else if (savedBox.objectType === 10) {
					this.colorRecursion(x, y);
				}
				// delete this.saved[JSON.stringify([x, y])];
			} else {
				this.safeDeleteBox(x, y);
			}
			// return;
		}

		this.lastCoords = [x, y];
	}
	restoreSaved(x, y) {}
	run() {}
}
