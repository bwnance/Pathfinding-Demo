import Two from "two.js";
export default class Demo {
	constructor() {
		this.grid = [];
		this.twoFg;
		this.twoBg;
		this.boxSize = 20;
		this.el = document.getElementById("render-section");
		this.setup();
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
	setupGrid(params) {
		const numLinesY = params.height / this.boxSize;
		const numLinesX = params.width / this.boxSize;
		for (let y = 0; y <= numLinesY; y++) {
			const yStep = y * this.boxSize - this.boxSize / 2;
			this.grid[y] = [];
			for (let x = 0; x <= numLinesX; x++) {
				const xStep = x * this.boxSize - this.boxSize / 2;
				let box = this.twoBg.makeRectangle(
					xStep,
					yStep,
					this.boxSize,
					this.boxSize
				);
				// box = this.twoFg.makeRectangle(xStep, yStep, boxSize, boxSize);
				box.stroke = "grey";
				box.fill = "rgba(0,0,0,0)";
                    
				this.grid[y].push({
					box: null,
					objectType: "blank",
					boxInfo: {
						x: xStep,
						y: yStep,
						width: this.boxSize,
						height: this.boxSize
					}
				});
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
			type: Two.Types.webgl
		};
		this.setupBG(params);
		this.setupFG(params);
	}

	handleMouseEvent(e) {
		if (e.buttons === 1) {
			const x = Math.floor(e.layerX / this.boxSize) + 1;
			const y = Math.floor(e.layerY / this.boxSize) + 1;
			if (this.grid[y][x] && this.grid[y][x].objectType === "wall") return;
			const boxy = this.twoFg.makeRectangle(
				...Object.values(this.grid[y][x].boxInfo)
			);
			boxy.stroke = "grey";
			boxy.fill = "red";
			this.grid[y][x].box = boxy;
			this.grid[y][x].objectType = "wall";
			this.twoFg.update();
		} else if (e.buttons === 2) {
			e.preventDefault();
			const x = Math.floor(e.layerX / this.boxSize) + 1;
			const y = Math.floor(e.layerY / this.boxSize) + 1;
			if (this.grid[y][x].box && this.grid[y][x].objectType === "blank") return;
			this.grid[y][x].objectType = "blank";
			this.twoFg.remove(this.grid[y][x].box);
			this.twoFg.update();
		}
	}
	run() {}
}
