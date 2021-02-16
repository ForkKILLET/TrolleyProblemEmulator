const {
	psize, color, font, image
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
	size: 600 / psize,
	ctx: document.getElementById("game").getContext("2d"),
	draw(x, y, p) {
		if (typeof p === "string") p = p.split("\n")
		p = p.filter((s, k) => (k !== 0 && k !== p.length - 1) || s !== "")
		for (let r = 0; r < p.length; r++)
		for (let c = 0; c < p[r].length; c++) {
			ui.ctx.fillStyle = color[p[r][c]]
			ui.ctx.fillRect((x + c) * psize, (y + r) * psize, psize, psize)
		}
	},
	text(x, y, t, fc = "#", bc = "-", gx = 6, gy = 6) {
		if (typeof t === "string") t = t.split("\n")
		for (let r = 0; r < t.length; r++)
		for (let c = 0; c < t[r].length; c++) {
			let f = font[t[r][c]]
			if (fc || bc) f = f
				.replaceAll("#", "{").replaceAll(" ", "}")
				.replaceAll("{", fc).replaceAll("}", bc)
			ui.draw(x + c * gx, y + r * gy, f)
		}
		return {
			reg: f => button.push({ f, x: x - 12, y }),
			reg_name: (n, f) => {
				if (button.find(n) === -1)
					button.push({ n, f, x: x - 12, y })
			}
		}
	},
	clear(c, x = 0, y = 0, m = ui.size, n = ui.size) {
		ui.board = c ?? " "
		ui.ctx.fillStyle = color[ui.board]
		ui.ctx.fillRect(x * psize, y * psize, m * psize, n * psize)
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
		ui.text(1, 1,
			Object.keys(font).join("").replace(/[^]{17}/g, "$&\n")
		)
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
		ui.text(13, 37, "[ START ]", "+").reg_name("start", stage.start)
		ui.text(13, 43, "[ TEST:FONT ]", "+").reg_name("test:font", () => {
			test.font()
			button.kill("github")
			button.kill("help")
			stage.menu()
		})
		ui.text(13, 49, "[ TEST:COLOR ]", "+").reg_name("test:color",
		() => {
			test.color()
			button.kill("github")
			button.kill("help")
			stage.menu()
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
			for (let x = d ? -4 : 0; x < ui.size; x += 6) {
				ui.draw(x, y, image.random("railway", 4))
				ui.draw(x, y + (d ? 4 : -1), image[
					"railway_" + (d ? "bottom" : "top")
				])
			}
		})
	},
	light(c) {
		[ 1, 2, 3 ].forEach(i =>
			ui.draw(100, 48 + i * 9, image.light.replaceAll(" ",
				{ "!": 1, "?": 2, "*": 3 }[c] === i ? c : "%"
			)
		))
		ui.draw(100, 48 + 4 * 9, image.light_pole)
	},
	help() {
		ui.text(100, 1, "?", "?").reg_name("help", () => {
			ui.text(100, 1, "N/A", "#", " ")
		})
	},
	start() {
		ui.clear()
		button.kill_all()
		stage.title()
		stage.railway()
		stage.light("*")

		god.move(0, 60, 1, 0, 200, 20)
	}
}

const god = {
	move_state: 1,
	move(x, y, dx, dy, ms, t) {
		ui.draw(x, y, image.god_head.trim() + image.god_body
			+ image[ "god_tentacle_" + god.move_state ].trim()
		)
		t && setTimeout(() => {
			ui.clear(" ", x - dx, y - dy, 16, 22)
			god.move_state = 3 - god.move_state
			god.move(x + dx, y + dy, dx, dy, ms, t - 1)
		}, ms)
	}
}

class player {

}

if (location.protocol === "file:") window.debug = {
	ui, test, stage,
	psize, color, font, image
}

window.onload = stage.init

window.onkeyup = e => {
	console.log(e.key)
	const l = button.length
	if (! l) return

	const o = button[button.focus]
	let d
	switch (e.code) {
	case "Enter":
	case "NumpadEnter":
	case "Space":
		o.f()
		return
	case "KeyJ":
	case "ArrowDown":
		d = 1
		break
	case "KeyK":
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

