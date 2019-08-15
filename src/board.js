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
		this.lines = [];
		this.carryingStart = false;
		this.carryingEnd = false;
		this.deleting = false;
		this.building = false;
		this.lastCoords = [];
	}
	setup() {
		this.setupCanvases();
		this.addListeners();
	}

	setupBG(params) {
		this.twoBg = new Two(params).appendTo(this.el);

		this.setupGrid(params);
		this.twoBg.render();
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
	colorBox(x, y, color, objectType = 1, override = false) {
		const stringCoords = JSON.stringify([x, y]);
		if (
			!override &&
			(stringCoords === JSON.stringify(this.targetCoords) ||
				stringCoords === JSON.stringify(this.startCoords))
		)
			return;
		if (this.grid[y][x].box) {
			this.grid[y][x].box.fill = color;
		} else {
			this.createBox(this.twoFg, x, y, color, true, objectType);
		}
		this.twoFg.update();
	}
	createBox(context, x, y, color, saveBox = false, objectType = 0) {
		const [xPos, yPos] = this.convertCoordinates(x, y);
		let box = context.makeRectangle(xPos, yPos, this.boxSize, this.boxSize);
		// let dot = context.makeCircle(xPos, yPos, 5);
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
	clearPath() {
		// this.twoFg.clear();
		this.lines.forEach(line => {
			this.twoFg.remove(line);
		});
		this.lines = [];
		this.grid.forEach((row, y) => {
			row.forEach((el, x) => {
				if (el.objectType === 1) return;
				this.twoFg.remove(el.box);
				el.box = null;
				el.objectType = 0;
				// if (el.box) this.twoFg.remove(el.box);
			});
		});
		this.setStart(...this.startCoords);
		this.setTarget(...this.targetCoords);
		this.twoFg.update();
	}
	clearWalls() {
		this.lines.forEach(line => {
			this.twoFg.remove(line);
		});
		this.lines = [];
		// this.twoFg.clear();
		this.grid.forEach((row, y) => {
			row.forEach((el, x) => {
				this.twoFg.remove(el.box);
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
		for (let y = 1; y <= numLinesY; y++) {
			// const yStep = y * this.boxSize - this.boxSize / 2;
			this.grid[y] = [];
			for (let x = 1; x <= numLinesX; x++) {
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
			type: Two.Types.svg
		};
		this.setupBG(params);
		this.setupFG(params);
	}
	clearEnd() {
		this.deleteBox(...this.targetCoords);
	}
	clearStart() {
		this.deleteBox(...this.startCoords);
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
	addListeners() {
		this.el.addEventListener("mousemove", this.handleMouseMove.bind(this));
		this.el.addEventListener("mousedown", this.handleMouseDown.bind(this));
		this.el.addEventListener("mouseup", this.handleMouseUp.bind(this));
		document.oncontextmenu = () => false;
	}
	handleMouseUp(e) {
		const x = Math.floor(e.layerX / this.boxSize) + 1;
		const y = Math.floor(e.layerY / this.boxSize) + 1;
		if (this.carryingStart) {
			this.carryingStart = false;
		}
		if (this.carryingEnd) {
			this.carryingEnd = false;
		}
		if(this.building){
			this.building = false;
		}
		if(this.deleting){
			this.deleting = false;
		}
	}
	handleMouseDown(e) {
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
		if (this.grid[y][x].objectType === 0) {
			this.building = true;
			this.colorBox(x, y, "rgb(150, 150, 150)", 1);
			return
		}
		if (this.grid[y][x].objectType === 1) {
			this.deleting = true;
			this.deleteBox(x, y);
			return
		}
	}
	handleMouseMove(e) {
		const x = Math.floor(e.layerX / this.boxSize) + 1;
		const y = Math.floor(e.layerY / this.boxSize) + 1;
		if (!this.grid[y] || !this.grid[y][x]) return;
		if(JSON.stringify(this.lastCoords) === JSON.stringify([x,y])) return
		this.lastCoords = [x,y];
		if (this.carryingEnd) {
			this.clearEnd();
			this.setTarget(x, y);
			return;
		}
		if (this.carryingStart) {
			this.clearStart();
			this.setStart(x, y);
			return;
		}
		if (this.building) {
			this.colorBox(x, y, "rgb(150, 150, 150)", 1);
			return
		}
		if (this.deleting) {
			this.deleteBox(x, y);
			return
		}
	}
	run() {}
}
