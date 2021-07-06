const {
	color, font, image
}			= require("./resource")

const query = new Proxy(new URLSearchParams(location.search), {
	get: (p, k) => p.get(k)
})

font.family = query.ff || "icelava"
font.size = + query.fs || 5

const csize = 750 / font.size

const layers = [ "stage", "move", "ui" ]

const route = {
	_stack: [],

	get top() { return route._stack[ route._stack.length - 1 ] },
	get now() { return route.top[route.top.focus] },
	push: (n, b) => {											// Param: `n`ame, `b`ack.
		if (n && route.top?.name === n) return
		const frame = Object.assign([], {
			_focus: null,
			name: n,
			back: b
		})
		Object.defineProperty(frame, "focus", {
			get: () => frame._focus,
			set: v => {
				route.clear_prompt()
				frame._focus = v
				if (v !== null) route.prompt()
			}
		})
		route._stack.push(frame)
	},
	pop: () => {
		route.clear_prompt()
		route.clear_timeout()
		const f = route.top.back
		route._stack.pop()
		f?.()
		route.prompt()
	},

	find: n => route.top.findIndex(b => b.n === n),				// Param: `n`ame.
	add: o => { route.top.push(o) },							// Param: `o`bject.
	rmv: n => {													// Param: `n`ame.
		const i = route.top.find(n), f = route.top.focus
		if (i === -1) return
		route.top.splice(i, 1)
		if (f === i) ui.clear_prompt()
		if (f > i) route.top.focus --
	},
	rmv_all: () => {
		route.top.focus = null
		route.top.length = 0
	},

	prompt() {
		if (route.top.focus === null) return
		const { x, y } = route.now
		ui.text("ui", x - 12, y, ">>", "+")
	},
	clear_prompt(b) {											// Param: `b`utton.
		if (route.top.focus === null) return
		let { x, y } = b ?? route.now
		ui.clear("ui", null, x - 12, y, 11, 5)
	},

	_timeout: [],
	timeout(f, ms) {											// Param: `f`unction, `m`illi`s`econd.
		route._timeout.push(setTimeout(f, ms))
	},
	interval(f, ms) {											// Param: `f`unction, `m`illi`s`econd.
		route._timeout.push(setInterval(f, ms))
	},
	clear_timeout() {
		route._timeout.forEach(id => clearTimeout(id))
	}
}

const help = {
	init: `
J / DOWN      FOCUS NEXT
K / UP        FOCUS PREV
H / LEFT /    BACK
DEL / BKSP
?             FOCUS ?
SP / ENTER    ACTIVE
R             REFRESH
~C            CLEAR ALL
`
}

const ui = {
	ctx: layers.reduce((a, L) => ((
		a[L] = document.getElementById(L).getContext("2d")
	), a), {}),
	raw(L, c, x, y, m, n) {
		if (c) ui.ctx[L].fillStyle = color[c]
		ui.ctx[L][ c ? "fillRect" : "clearRect" ](...[ x, y, m, n ].map(i => i * font.size))
	},
	draw(L, x, y, p) {											// Param: `L`ayer, `x`, `y`, `p`ixels.
		if (typeof p === "string") p = p.split("\n")
		p = p.filter((s, k) => (k !== 0 && k !== p.length - 1) || s !== "")
		for (let r = 0; r < p.length; r++)
		for (let c = 0; c < p[r].length; c++)
			ui.raw(L, p[r][c], x + c, y + r, 1, 1)
	},
	text(L, x, y, t, fc = "#", bc = "-", gx = 6, gy = 6) {		// Param: `L`ayer, `x`, `y`, `f`ore`g`round color, `b`ack`g`round color, `g`ap `x`, `g`ap `y`
		if (typeof t === "string") t = t.split("\n")
		for (let r = 0; r < t.length; r++)
		for (let c = 0; c < t[r].length; c++) {
			let f = font[font.family][t[r][c]]
			if (fc || bc) f = f
				.replaceAll("#", "{").replaceAll(" ", "}")
				.replaceAll("{", fc).replaceAll("}", bc)
			ui.draw(L, x + c * gx, y + r * gy, f)
		}
		return {
			reg: f => route.add({								// Param: `f`unction.
				x, y, m: t[0].length * 6, n: t.length * 6, f
			}),
			reg_name: (n, f, p) => {							// Param: `n`ame, `f`unction, `p`ush.
				if (route.find(n) === -1) route.add({
					x, y, m: t[0].length * 6, n: t.length * 6,
					f: p ? () => { f(); route.push(n, p) } : f
				})
			}
		}
	},
	clear(L, c, x = 0, y = 0, m = csize, n = csize) {			// Param: `L`ayer, `c`olor, `x`, `y`, `m`, `n`.
		if (c) ui.ctx[L].fillStyle = color[c]
		ui.raw(L, c, x, y, m, n)
	},
	clear_image(L, x, y, p) {
		p = p.trim().split("\n")
		ui.clear(L, null, x, y, p[0].length, p.length)
	},
	clear_all() {
		layers.map(L => ui.clear(L))
	}
}

const test = {
	font() {
		ui.clear("ui", null, 0, 80)
		ui.text("ui", 1, 80,
			Object.keys(font[font.family]).join("").replace(/[^]{17}/g, "$&\n")
		)
	},
	color() {
		ui.clear("ui", null, 0, 80)
		let i = 0
		for (let c of Object.keys(color))
			ui.text("ui", 1 + (i ++) * 6, 80, c, c, " ")
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
		ui.text("ui", 13, 37, "[ START ]", "+").reg_name("start", stage.start, stage.init)
		ui.text("ui", 13, 43, "[ TEST:FONT ]", "+").reg_name("test:font", test.font)
		ui.text("ui", 13, 49, "[ TEST:COLOR ]", "+").reg_name("test:color", test.color)
		ui.text("ui", 13, 55, "[ FUN:TPGOD ]", "=").reg_name("fun:tpgod", () => {
			ui.clear("ui")
			tpgod.place(10, 10).move(0, 0, 0, 0)
			route.timeout(() => tpgod.move(
				eval("t => " + prompt("dx = t => ...")),
				eval("t => " + prompt("dy = t => ...")),
				+ prompt("ms"), + prompt("t")
			), 1000)
		}, true)
	},
	init() {
		route.push("init")
		ui.clear_all()
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
		ui.text("ui", 140, 1, "?", "?").reg_name("help", () => {
			ui.clear("ui", null, 0, 80)
			ui.text("ui", 1, 80, help.init.trim(), "#")
		})
	},
	start() {
		ui.clear("stage")
		ui.clear("ui")
		stage.title()
		stage.railway()
		stage.light("*")

		tpgod.place(0, 60).move(1, 0, 200, 20)
	}
}

const tpgod = {
	move_state: 1,
	place(x, y) {												// Param: `x`, `y`.
		tpgod.x = x; tpgod.y = y
		return tpgod
	},
	move(dx, dy, ms, t) {										// Param: `dx`, `dy`, `m`illi`s`econd, `t`imes.
		const { x, y } = tpgod,
			fx = typeof dx === "function" ? dx(t) : dx,
			fy = typeof dy === "function" ? dy(t) : dy

		ui.draw("move", tpgod.x, tpgod.y, image.cat(
			"tpgod_head", "tpgod_body", "tpgod_tentacle_" + tpgod.move_state
		))
		if (t) route.timeout(() => {
			ui.clear("move", " ", x - fx, y - fy, 17, 22)
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
		this.bind_state = 0
	}
	place(r, i) {												// Param: `r`ailway, `i`ndex.
		this.r = r; this.i = i
		this.y = r ? 85 : 25; this.x = 15 * i
		return this
	}
	appear() {
		if ([ this.x, this.y ].includes()) return
		ui.draw("move", this.x, this.y, image.cat_ex(
			"player_head_citizen_overlook", "player_body_overlook"
		)(
			{ _: 10, S: this.look.skin, E: this.look.eyes, M: this.look.mouth },
			{ C: this.look.cloth })
		)
		return this
	}
	disappear() {
		ui.clear("move", null, this.x - 1, this.y, 20, 12)
		return this
	}
	bind() {
		route.interval(() => {
			this.disappear().appear()
			this.bind_state ++
			if (this.bind_state === 5) this.bind_state = 1
			ui.draw("move", this.x - 1, this.y + 5, image[ "ground_tentacle_" + this.bind_state ])
		}, 900)
		return this
	}
}

if (location.protocol === "file:") window.debug = {
	route,
	ui, test, stage,
	tpgod, player,
	csize, layers,
	color, font, image
}

window.onload = stage.init

window.onkeyup = e => {
	let d; switch (e.key) {
	case "Enter":
	case " ":
		route.now?.f()
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
		route.top.focus = route.find("help")
		return
	case "r":
		location.reload()
		return
	case "C":
		ui.clear_all()
		return
	case "Delete":
	case "Backspace":
	case "h":
	case "ArrowLeft":
		route.pop()
		return
	default:
		return
	}

	const l = route.top.length
	let f = route.top.focus
	if (! l) return
	if (d) f = f === null ? 0 : f + d
	if (f === -1) f = l - 1
	if (f === l) f = 0
	route.top.focus = f
}

ui.ctx.ui.canvas.onclick = e => {
	let { offsetX: x, offsetY: y } = e
	x /= 5; y /= 5

	route.top.forEach((b, i) => {
		const dx = x - b.x, dy = y - b.y
		if (dx >= 0 && dx <= b.m && dy >= 0 && dy <= b.n) {
			if (route.top.focus === i) b.f()
			else route.top.focus = i
		}
	})
}

