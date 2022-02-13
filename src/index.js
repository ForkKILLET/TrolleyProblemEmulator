import { color, random_color, font, image } from "./resource.js"

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
		if (route._stack.length === 1) return

		route.clear_prompt()
		route.clear_timeout()
		route._stack.pop()
		route.top.back?.(true)
		route.prompt()
	},

	find: N => route.top.findIndex(b => b.N === N),				// Param: `n`ame.
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
		route.now.clear = ui.text("ui", x - 12, y, ">>", "+").clear
	},
	clear_prompt(b) {											// Param: `b`utton.
		if (route.top.focus === null) return
		(b ?? route.now).clear()
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
		c = color[c]
		if (c) ui.ctx[L].fillStyle = c
		ui.ctx[L][ c ? "fillRect" : "clearRect" ](...[ x, y, m, n ].map(i => i * font.size))
	},
	draw(L, x, y, p) {											// Param: `L`ayer, `x`, `y`, `p`ixels.
		if (typeof p === "string") p = p.split("\n")
		p = p.filter((s, k) => (k !== 0 && k !== p.length - 1) || s !== "")
		for (let r = 0; r < p.length; r++)
		for (let c = 0; c < p[r].length; c++)
			ui.raw(L, p[r][c], x + c, y + r, 1, 1)
		return {
			clear: () => ui.draw(L, x, y, p.map(row => row.replace(/[^-]/g, "x")))
		}
	},
	text(L, x, y, t, fc = "#", bc = "-", gx = 6, gy = 6) {		// Param: `L`ayer, `x`, `y`, `f`ore`g`round color, `b`ack`g`round color, `g`ap `x`, `g`ap `y`
		if (typeof t === "string") t = t.split("\n")
		for (let r = 0; r < t.length; r++)
		for (let c = 0; c < t[r].length; c++) {
			let f = font[font.family][ t[r][c].toUpperCase() ]
			if (fc || bc) f = f
				.replaceAll("#", "{").replaceAll(" ", "}")
				.replaceAll("{", fc).replaceAll("}", bc)
			ui.draw(L, x + c * gx, y + r * gy, f).clear
		}
		return {
			reg: f => route.add({								// Param: `f`unction.
				x, y, m: t[0].length * 6, n: t.length * 6, f
			}),
			reg_name: (N, f) => {								// Param: `n`ame, `f`unction.
				if (route.find(N) === -1) route.add({
					N, x, y, m: t[0].length * 6, n: t.length * 6, f
				})
			},
			clear: () => ui.text(L, x, y, t, "x", bc === "-" ? "-" : "x", gx, gy)
		}
	},
	clear(L, x = 0, y = 0, m = csize, n = csize) {				// Param: `L`ayer, `c`olor, `x`, `y`, `m`, `n`.
		ui.raw(L,"x" , x, y, m, n)
	},
	clear_all() {
		layers.map(L => ui.clear(L))
	}
}

const test = {
	font() {
		ui.clear("ui", 0, 80)
		ui.text("ui", 1, 80,
			Object.keys(font[font.family]).join("").replace(/[^]{17}/g, "$&\n")
		)
	},
	color() {
		ui.clear("ui", 0, 80)
		for (const [ i, [ c ] ] of Object.entries(color).entries()) {
			ui.text("ui", 1 + i * 6, 80, c, "#", " ")
			ui.text("ui", 1 + i * 6, 86, c, c, " ")
		}
	}
}

const fun = {
	tpgod: () => {
		route.push("fun:tpgod")
		ui.clear("ui")
		tpgod.place(10, 10).move(0, 0, 0, 0)
		route.timeout(() => tpgod.move(
			eval("t => " + prompt("dx = t => ...")),
			eval("t => " + prompt("dy = t => ...")),
			+ prompt("ms"), + prompt("t")
		), 1000)
	},
	bind: () => {
		stage.start()
		const [ skin, eyes, mouth, cloth ] = Array.from({ length: 4 }, random_color)
		const p = new player({ skin, eyes, mouth, cloth })
		p.place(0, 1).appear().bind()
		route.interval(() => p.move(+ (Math.random() > 0.5), ~~ (Math.random() * 1e6) % 9), 6000)
	}
}

const stage = {
	title() {
		ui.text("ui", 1, 1, "TROLLEY PROBLEM", "!")
		ui.text("ui", 1, 7, "<<<<   EMULATOR", "#")
	},
	author() {
		ui.text("ui", 1, 19, "@", "@")
		ui.text("ui", 7, 19, "FORKΨKILLET", "#")
		ui.text("ui", 13, 25, "GITHUB:FK/TPE", "@").reg_name("github", () =>
			open("https://github.com/ForkKILLET/TrolleyProblemEmulator")
		)
	},
	menu() {
		ui.text("ui", 13, 37, "[ START ]", "+").reg_name("start", stage.start)
		ui.text("ui", 13, 43, "[ TEST:FONT ]", "+").reg_name("test:font", test.font)
		ui.text("ui", 13, 49, "[ TEST:COLOR ]", "+").reg_name("test:color", test.color)
		ui.text("ui", 13, 55, "[ FUN:TPGOD ]", "=").reg_name("fun:tpgod", fun.tpgod)
		ui.text("ui", 13, 61, "[ FUN:BIND ]", "=").reg_name("fun:bind", fun.bind)
	},
	init(back) {
		back || route.push("init", stage.init)
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
			ui.clear("ui", 0, 80)
			ui.text("ui", 1, 80, help.init.trim(), "#")
		})
	},
	start() {
		route.push("start")
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
		const fx = typeof dx === "function" ? dx(t) : dx
		const fy = typeof dy === "function" ? dy(t) : dy

		const { clear } = ui.draw("move", tpgod.x, tpgod.y, image.cat(
			"tpgod_head", "tpgod_body", "tpgod_tentacle_" + tpgod.move_state
		))
		if (t) route.timeout(() => {
			clear()
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
	place(r, i) {												// Param: `r`ailway, `i`ndex.
		this.r = r; this.i = i
		this.y = r ? 85 : 25; this.x = 15 * i
		this.bind_state = 0
		return this
	}
	appear() {
		if ([ this.x, this.y ].includes()) return
		this.disappear()
		this.clear = ui.draw("move", this.x, this.y, image.cat_ex(
			"player_head_citizen_overlook", "player_body_overlook"
		)(
			{ _: 10, S: this.look.skin, E: this.look.eyes, M: this.look.mouth },
			{ C: this.look.cloth })
		).clear
		return this
	}
	disappear() {
		this.clear?.()
		this.clear_bind?.()
		this.clear = null
		this.clear_bind = null
		return this
	}
	move(r, i) {
		return this.disappear().place(r, i).appear()
	}
	bind() {
		route.interval(() => {
			this.appear()
			this.bind_state ++
			if (this.bind_state === 5) this.bind_state = 1
			this.clear_bind = ui.draw("move", this.x - 1, this.y + 5, image[ "ground_tentacle_" + this.bind_state ]).clear
		}, 900)
		return this
	}
}

if (query.debug) window.debug = {
	route,
	ui, test, stage,
	tpgod, player,
	csize, layers,
	color, random_color, font, image
}

window.addEventListener("keyup", e => {
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
		if (route._stack.length === 1)
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
})

ui.ctx.ui.canvas.addEventListener("click", e => {
	let { offsetX: x, offsetY: y } = e
	x /= font.size; y /= font.size

	route.top.forEach((b, i) => {
		const dx = x - b.x, dy = y - b.y
		if (dx >= 0 && dx <= b.m && dy >= 0 && dy <= b.n) {
			if (route.top.focus === i) b.f()
			else route.top.focus = i
		}
	})
})

stage.init()
