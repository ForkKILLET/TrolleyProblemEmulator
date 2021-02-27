const {
	psize, color, font, image
} = require("./resource")

const csize = 600 / psize
const layers = [ "stage", "move", "ui" ]

const button = Object.assign([], {
	focus: null,
	find: n => button.findIndex(b => b.n === n),
	kill: n => {
		const i = button.find(n)
		if (i === -1) return
		button.splice(i, 1)
		if (button.focus === i) ui.clear_prompt()
		if (button.focus > i) button.focus --
	},
	kill_all: () => {
		ui.clear_prompt()
		button.length = 0
		button.focus = null
	}
})

const help = {
	init: `
[ J / DOWN ]
  FOCUS NEXT
[ K / UP ]
  FOCUS PREVIOUS
[ ? ]
  FOCUS ?
[ SPACE / ENTER ]
  ACTIVE
[ R ]
  REFRESH
[ C ] !
  CLEAR ALL
`
}

const ui = {
	ctx: layers.reduce((acc, L) => {
		acc[L] = document.getElementById(L).getContext("2d")
		return acc
	}, {}),
	draw(L, x, y, p) {
		if (typeof p === "string") p = p.split("\n")
		p = p.filter((s, k) => (k !== 0 && k !== p.length - 1) || s !== "")
		for (let r = 0; r < p.length; r++)
		for (let c = 0; c < p[r].length; c++) {
			ui.ctx[L].fillStyle = color[p[r][c]]
			ui.ctx[L].fillRect((x + c) * psize, (y + r) * psize, psize, psize)
		}
	},
	text(L, x, y, t, fc = "#", bc = "-", gx = 6, gy = 6) {
		if (typeof t === "string") t = t.split("\n")
		for (let r = 0; r < t.length; r++)
		for (let c = 0; c < t[r].length; c++) {
			let f = font[t[r][c]]
			if (fc || bc) f = f
				.replaceAll("#", "{").replaceAll(" ", "}")
				.replaceAll("{", fc).replaceAll("}", bc)
			ui.draw(L, x + c * gx, y + r * gy, f)
		}
		return {
			reg: f => button.push({ f, x: x - 12, y }),
			reg_name: (n, f) => {
				if (button.find(n) === -1)
					button.push({ n, f, x: x - 12, y })
			}
		}
	},
	clear(L, c, x = 0, y = 0, m = csize, n = csize) {
		if (c) ui.ctx[L].fillStyle = color[c ?? " "]
		ui.ctx[L][ c ? "fillRect" : "clearRect" ](
			x * psize, y * psize, m * psize, n * psize
		)
	},
	clear_all() {
		layers.map(L => ui.clear(L))
	},
	prompt() {
		if (button.focus === null) return
		const b = button[button.focus]
		ui.text("ui", b.x, b.y, ">>", "+")
	},
	clear_prompt(b) {
		if (button.focus === null) return
		let { x, y } = b ?? button[button.focus]
		ui.clear("ui", null, x, y, 11, 5)
	}
}

const test = {
	font() {
		ui.clear("ui")
		ui.text("ui", 1, 1,
			Object.keys(font).join("").replace(/[^]{17}/g, "$&\n")
		)
	},
	color() {
		ui.clear("ui")
		ui.clear("stage", "%")
		let i = 0
		for (let c of Object.keys(color))
			ui.text("ui", 1 + (i ++) * 6, 1, c, c, " ")
	}
}

const stage = {
	title() {
		ui.text("ui", 1, 1, "TRAIN PROBLEM", "#")
		ui.text("ui", 1, 7, "<<<< EMULATOR", "!")
	},
	author() {
		ui.text("ui", 1, 19, "@", "@")
		ui.text("ui", 7, 19, "FORKΨKILLET", "#")
		ui.text("ui", 13, 25, "GITHUB:FORKFG/TPE", "@").reg_name("github", () =>
			open("https://github.com/ForkFG/TrainProblemEmulator")
		)
	},
	menu() {
		ui.text("ui", 13, 37, "[ START ]", "+").reg_name("start", stage.start)
		ui.text("ui", 13, 43, "[ TEST:FONT ]", "+").reg_name("test:font", () => {
			test.font()
			button.kill("github")
			button.kill("help")
			stage.menu()
		})
		ui.text("ui", 13, 49, "[ TEST:COLOR ]", "+").reg_name("test:color", () => {
			test.color()
			button.kill("github")
			button.kill("help")
			stage.menu()
		})
		ui.text("ui", 13, 55, "[ FUN:TPGOD ]", "=").reg_name("fun:tpgod", () => {
			ui.clear("ui")
			button.kill_all()
			tpgod.appear(10, 10).move(0, 0, 0, 0)
			setTimeout(() => tpgod.move(
				eval("t => " + prompt("dx = t => ...")),
				eval("t => " + prompt("dy = t => ...")),
				+ prompt("ms"), + prompt("t")
			), 1000)
		})
		ui.prompt()
	},
	init() {
		stage.title()
		stage.menu()
		stage.author()
		stage.help()
	},
	railway() {
		[ 30, 34, 90, 94 ].forEach(y => {
			let d = y % 10
			for (let x = d ? -4 : 0; x < csize; x += 6) {
				ui.draw("stage", x, y, image.random("railway", 4))
				ui.draw("stage", x, y + (d ? 4 : -1), image[
					"railway_" + (d ? "bottom" : "top")
				])
			}
		})
	},
	light(c) {
		ui.draw("stage", 100, 58, image.cat_ex(
			...Array.from({ length: 3 }, () => "light"), "light_pole"
		)(
			...Array.from({ length: 3 }, (_, k) => ({ L: "!?*"[k] === c ? c : "%" }))
		))
	},
	help() {
		ui.text("ui", 100, 1, "?", "?").reg_name("help", () => {
			ui.clear("ui")
			ui.text("ui", 1, 1, help.init, "#")
		})
	},
	start() {
		ui.clear("stage")
		ui.clear("ui")
		button.kill_all()
		stage.title()
		stage.railway()
		stage.light("*")

		tpgod.appear(0, 60).move(1, 0, 200, 20)
	}
}

const tpgod = {
	move_state: 1,
	appear(x, y) {
		tpgod.x = x; tpgod.y = y
		return tpgod
	},
	move(dx, dy, ms, t) {
		const { x, y } = tpgod,
			fx = typeof dx === "function" ? dx(t) : dx,
			fy = typeof dy === "function" ? dy(t) : dy

		ui.draw("move", tpgod.x, tpgod.y, image.cat(
			"tpgod_head", "tpgod_body", "tpgod_tentacle_" + tpgod.move_state
		))
		if (t) setTimeout(() => {
			ui.clear("move", " ", x - fx, y - fy, 16, 22)
			tpgod.move_state = 3 - tpgod.move_state
			tpgod.x += fx; tpgod.y += fy
			tpgod.move(dx, dy, ms, t - 1)
		}, ms)
		return tpgod
	}
}

class player {
	constructor(look) {
		this.look = { ...look }
	}
	place(r, i) {
		ui.draw("move", 15 * i, r ? 85 : 25, image.cat_ex(
			"player_head_citizen_overlook", "player_body_overlook"
		)(
			{ _: 10, S: this.look.skin, E: this.look.eyes, M: this.look.mouth },
			{ C: this.look.cloth })
		)
	}
}

if (location.protocol === "file:") window.debug = {
	button,
	ui, test, stage,
	tpgod, player,
	csize, layers,
	psize, color, font, image
}

window.onload = stage.init

window.onkeyup = e => {
	let d; switch (e.key) {
	case "Enter":
	case " ":
		button[button.focus].f()
		return
	case "j":
	case "ArrowDown":
		d = 1
		break
	case "k":
	case "ArrowUp":
		d = -1
		break
	case "?":
		button.focus = button.find("help")
		break
	case "R":
	case "r":
		location.reload()
		return
	case "C":
		ui.clear_all()
		return
	default:
		return
	}

	const l = button.length
	if (! l) return
	if (button.focus === null)
		if (d) button.focus = 0
		else return
	else {
		ui.clear_prompt()
		if (d) button.focus += d
	}
	if (button.focus === -1) button.focus = l - 1
	if (button.focus === l) button.focus = 0
	ui.prompt()
}

