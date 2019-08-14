import Two from "two.js";
export default class Board {
	constructor() {
		this.grid = [];
		this.twoFg;
		this.twoBg;
		this.boxSize = 30;
		this.el = document.getElementById("render-section");
		this.setup();
		this.startCoords;
		this.targetCoords;
	}
	setup() {
		this.setupCanvases();
		this.addListeners();
	}
	addListeners() {
		this.el.addEventListener("mousemove", this.handleMouseEvent.bind(this));
		this.el.addEventListener("mousedown", this.handleMouseEvent.bind(this));
		document.oncontextmenu = () => false;
	}
	setupBG(params) {
		this.twoBg = new Two(params).appendTo(this.el);

		this.setupGrid(params);
		this.twoBg.render();
	}
	colorBox(x, y, color, objectType = 1, override = false) {
		const stringCoords = JSON.stringify([x, y]);
		if (!override && 
			(stringCoords === JSON.stringify(this.targetCoords) ||
			stringCoords === JSON.stringify(this.startCoords))
		) return
			if (this.grid[y][x].box) {
				this.grid[y][x].box.fill = color;
			} else {
				this.createBox(this.twoFg, x, y, color, true, objectType);
				this.twoFg.update();
			}
	}
	createBox(context, x, y, color, saveBox = false, objectType = 0) {
		const [xPos, yPos] = this.convertCoordinates(x, y);
		let box = context.makeRectangle(xPos, yPos, this.boxSize, this.boxSize);
		box.stroke = "rgb(180,180,180)";
		box.fill = color;
		this.grid[y][x] = {
			box: saveBox ? box : null,
			objectType: objectType,
			boxInfo: {
				x: xPos,
				y: yPos,
				width: this.boxSize,
				height: this.boxSize
			}
		};
	}
	clear() {
		this.twoFg.clear();
		this.grid.forEach((row, y) => {
			row.forEach((el, x) => {
				el.box = null;
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
	setStart(x, y) {
		// const [xPos, yPos] = this.convertCoordinates(x, y);
		this.colorBox(x, y, "green", 2, true);
		this.startCoords = [x, y];
	}
	setTarget(x, y) {
		this.colorBox(x, y, "red", 3, true);
		this.targetCoords = [x, y];
	}
	deleteBox(x, y) {
		const el = this.grid[y][x];
		el.objectType = 0;
		this.twoFg.remove(el.box);
		el.box = null;
		this.twoFg.update();
	}
	setupGrid(params) {
		const numLinesY = params.height / this.boxSize;
		const numLinesX = params.width / this.boxSize;
		for (let y = 0; y <= numLinesY; y++) {
			// const yStep = y * this.boxSize - this.boxSize / 2;
			this.grid[y] = [];
			for (let x = 0; x <= numLinesX; x++) {
				// const xStep = x * this.boxSize - this.boxSize / 2;
				this.createBox(this.twoBg, x, y, "rgba(0,0,0,0)");
				// let box = this.twoBg.makeRectangle(
				// 	xStep,
				// 	yStep,
				// 	this.boxSize,
				// 	this.boxSize
				// );
				// // box = this.twoFg.makeRectangle(xStep, yStep, boxSize, boxSize);
				// box.stroke = "rgb(180,180,180)";
				// box.fill = "rgba(0,0,0,0)";

				// this.grid[y].push({
				// 	box: null,
				// 	objectType: 0,
				// 	boxInfo: {
				// 		x: xStep,
				// 		y: yStep,
				// 		width: this.boxSize,
				// 		height: this.boxSize
				// 	}
				// });
			}
		}
	}
	setupFG(params) {
		this.twoFg = new Two(params).appendTo(this.el);
		this.twoBg.render();
	}
	setupCanvases() {
		const height =
			this.boxSize +
			Math.floor(this.el.offsetHeight / this.boxSize) * this.boxSize;

		const width =
			this.boxSize +
			Math.floor(this.el.offsetWidth / this.boxSize) * this.boxSize;

		const params = {
			width: width,
			height: height,
			type: Two.Types.canvas
		};
		this.setupBG(params);
		this.setupFG(params);
	}

	handleMouseEvent(e) {
		if (e.buttons === 1) {
			const x = Math.floor(e.layerX / this.boxSize) + 1;
			const y = Math.floor(e.layerY / this.boxSize) + 1;
			if (this.grid[y][x].objectType === 2 || this.grid[y][x].objectType === 3)
				return;
			if (this.grid[y][x] && this.grid[y][x].objectType === 1) return;
			this.colorBox(x, y, "rgb(150, 150, 150)", 1);
		} else if (e.buttons === 2) {
			e.preventDefault();
			const x = Math.floor(e.layerX / this.boxSize) + 1;
			const y = Math.floor(e.layerY / this.boxSize) + 1;
			if (this.grid[y][x].box && this.grid[y][x].objectType === 0) return;
			if (this.grid[y][x].objectType === 2 || this.grid[y][x].objectType === 3)
				return;
			this.deleteBox(x, y);
		}
	}
	run() {}
}
