const {
	psize, color, font
} = require("./resource")

const button = Object.assign([], {
	focus: null,
	find: n => button.findIndex(b => b.n === n),
	kill: n => {
		const i = button.find(n)
		if (i === -1) return
		button.splice(i, 1)
		if (button.focus > i) button.focus --
	},
	kill_all: () => {
		button.length = 0
		button.focus = null
	}
})

const ui = {
	board: " ",
	ctx: document.getElementById("game").getContext("2d"),
	draw(x, y, p) {
		if (typeof p === "string") p = p.split("\n")
		p = p.filter((s, k) => (k !== 0 && k !== p.length - 1) || s !== "")
		for (let r = 0; r < p.length; r++) for (let c = 0; c < p[r].length; c++) {
			ui.ctx.fillStyle = color[p[r][c]]
			ui.ctx.fillRect((x + c) * psize, (y + r) * psize, psize, psize)
		}
	},
	text(x, y, t, fc = "#", bc = "-", gx = 6, gy = 6) {
		if (typeof t === "string") t = t.split("\n")
		for (let r = 0; r < t.length; r++) for (let c = 0; c < t[r].length; c++) {
			let f = font[t[r][c]]
			if (fc || bc) f = f
				.replaceAll("#", "{").replaceAll(" ", "}")
				.replaceAll("{", fc).replaceAll("}", bc)
			ui.draw(x + c * gx, y + r * gy, f)
		}
		return {
			reg: f => button.push({ f, x: x - 12, y }),
			reg_name: (n, f) => {
				if (button.find(n) === -1) button.push({ n, f, x: x - 12, y })
			}
		}
	},
	clear(c) {
		ui.board = c ?? " "
		ui.ctx.fillStyle = color[ui.board]
		ui.ctx.fillRect(0, 0, 600, 600)
	},
	prompt() {
		if (button.focus === null) return
		const n = button[button.focus]
		ui.text(n.x, n.y, ">>", "+")
	}
}

const test = {
	font() {
		ui.clear()
		ui.text(1, 1, Object.keys(font).join("").replace(/[^]{17}/g, "$&\n"))
	},
	color() {
		ui.clear("%")
		let i = 0
		for (let c of Object.keys(color))
			ui.text(1 + (i ++) * 6, 1, c, c, " ")
	}
}

const stage = {
	title() {
		ui.text(1, 1, "TRAIN PROBLEM", "#")
		ui.text(1, 7, "<<<< EMULATOR", "!")
	},
	author() {
		ui.text(1, 19, "@", "@")
		ui.text(7, 19, "FORKΨKILLET", "#")
		ui.text(13, 25, "GITHUB:FORKFG/TPE", "@").reg_name("github", () =>
			open("https://github.com/ForkFG/TrainProblemEmulator")
		)
	},
	menu() {
		ui.text(13, 37, "[ START ]", "+").reg_name("start", () => {
			ui.clear()
			button.kill_all()
		})
		ui.text(13, 43, "[ TEST:FONT ]", "+").reg_name("test:font", () => {
			test.font()
			button.kill("github")
			stage.menu()
		})
		ui.text(13, 49, "[ TEST:COLOR ]", "+").reg_name("test:color", () => {
			test.color()
			button.kill("github")
			stage.menu()
		})
		ui.prompt()
	},
	init() {
		stage.title()
		stage.author()
		stage.menu()
	}
}

if (location.protocol === "file:") window.debug = { ui, test, stage }

window.onload = stage.init

window.onkeyup = e => {
	const l = button.length
	if (! l) return

	const o = button[button.focus]
	let d
	switch (e.code) {
	case "Enter":
	case "Space":
		o.f()
		return
	case "ArrowDown":
		d = 1
		break
	case "ArrowUp":
		d = -1
		break
	default:
		return
	}

	if (button.focus === null)
		if (d) button.focus = 0
		else return
	else {
		ui.text(o.x, o.y, "  ", null, ui.board)
		button.focus += d
	}
	if (button.focus === -1) button.focus = l - 1
	if (button.focus === l) button.focus = 0
	ui.prompt()
}

