(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var _require = require("./resource"),
    _color = _require.color,
    _font = _require.font,
    image = _require.image;

var query = new Proxy(new URLSearchParams(location.search), {
  get: function get(p, k) {
    return p.get(k);
  }
});
_font.family = query.ff || "icelava";
_font.size = +query.fs || 5;
var csize = 750 / _font.size;
var layers = ["stage", "move", "ui"];
var route = {
  _stack: [],

  get top() {
    return route._stack[route._stack.length - 1];
  },

  get now() {
    return route.top[route.top.focus];
  },

  push: function push(n, b) {
    var _route$top;

    // Param: `n`ame, `b`ack.
    if (n && ((_route$top = route.top) === null || _route$top === void 0 ? void 0 : _route$top.name) === n) return;
    var frame = Object.assign([], {
      _focus: null,
      name: n,
      back: b
    });
    Object.defineProperty(frame, "focus", {
      get: function get() {
        return frame._focus;
      },
      set: function set(v) {
        route.clear_prompt();
        frame._focus = v;
        if (v !== null) route.prompt();
      }
    });

    route._stack.push(frame);
  },
  pop: function pop() {
    route.clear_prompt();
    route.clear_timeout();
    var f = route.top.back;

    route._stack.pop();

    f === null || f === void 0 ? void 0 : f();
    route.prompt();
  },
  find: function find(n) {
    return route.top.findIndex(function (b) {
      return b.n === n;
    });
  },
  // Param: `n`ame.
  add: function add(o) {
    route.top.push(o);
  },
  // Param: `o`bject.
  rmv: function rmv(n) {
    // Param: `n`ame.
    var i = route.top.find(n),
        f = route.top.focus;
    if (i === -1) return;
    route.top.splice(i, 1);
    if (f === i) ui.clear_prompt();
    if (f > i) route.top.focus--;
  },
  rmv_all: function rmv_all() {
    route.top.focus = null;
    route.top.length = 0;
  },
  prompt: function prompt() {
    if (route.top.focus === null) return;
    var _route$now = route.now,
        x = _route$now.x,
        y = _route$now.y;
    ui.text("ui", x - 12, y, ">>", "+");
  },
  clear_prompt: function clear_prompt(b) {
    // Param: `b`utton.
    if (route.top.focus === null) return;

    var _ref = b !== null && b !== void 0 ? b : route.now,
        x = _ref.x,
        y = _ref.y;

    ui.clear("ui", null, x - 12, y, 11, 5);
  },
  _timeout: [],
  timeout: function timeout(f, ms) {
    // Param: `f`unction, `m`illi`s`econd.
    route._timeout.push(setTimeout(f, ms));
  },
  interval: function interval(f, ms) {
    // Param: `f`unction, `m`illi`s`econd.
    route._timeout.push(setInterval(f, ms));
  },
  clear_timeout: function clear_timeout() {
    route._timeout.forEach(function (id) {
      return clearTimeout(id);
    });
  }
};
var _help = {
  init: "\nJ / DOWN      FOCUS NEXT\nK / UP        FOCUS PREV\nH / LEFT /    BACK\nDEL / BKSP\n?             FOCUS ?\nSP / ENTER    ACTIVE\nR             REFRESH\n~C            CLEAR ALL\n"
};
var ui = {
  ctx: layers.reduce(function (a, L) {
    return a[L] = document.getElementById(L).getContext("2d"), a;
  }, {}),
  raw: function raw(L, c, x, y, m, n) {
    var _ui$ctx$L;

    if (c) ui.ctx[L].fillStyle = _color[c];

    (_ui$ctx$L = ui.ctx[L])[c ? "fillRect" : "clearRect"].apply(_ui$ctx$L, _toConsumableArray([x, y, m, n].map(function (i) {
      return i * _font.size;
    })));
  },
  draw: function draw(L, x, y, p) {
    // Param: `L`ayer, `x`, `y`, `p`ixels.
    if (typeof p === "string") p = p.split("\n");
    p = p.filter(function (s, k) {
      return k !== 0 && k !== p.length - 1 || s !== "";
    });

    for (var r = 0; r < p.length; r++) {
      for (var c = 0; c < p[r].length; c++) {
        ui.raw(L, p[r][c], x + c, y + r, 1, 1);
      }
    }
  },
  text: function text(L, x, y, t) {
    var fc = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "#";
    var bc = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : "-";
    var gx = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 6;
    var gy = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 6;
    // Param: `L`ayer, `x`, `y`, `f`ore`g`round color, `b`ack`g`round color, `g`ap `x`, `g`ap `y`
    if (typeof t === "string") t = t.split("\n");

    for (var r = 0; r < t.length; r++) {
      for (var c = 0; c < t[r].length; c++) {
        var f = _font[_font.family][t[r][c]];
        if (fc || bc) f = f.replaceAll("#", "{").replaceAll(" ", "}").replaceAll("{", fc).replaceAll("}", bc);
        ui.draw(L, x + c * gx, y + r * gy, f);
      }
    }

    return {
      reg: function reg(f) {
        return route.add({
          // Param: `f`unction.
          x: x,
          y: y,
          m: t[0].length * 6,
          n: t.length * 6,
          f: f
        });
      },
      reg_name: function reg_name(n, f, p) {
        // Param: `n`ame, `f`unction, `p`ush.
        if (route.find(n) === -1) route.add({
          x: x,
          y: y,
          m: t[0].length * 6,
          n: t.length * 6,
          f: p ? function () {
            f();
            route.push(n, p);
          } : f
        });
      }
    };
  },
  clear: function clear(L, c) {
    var x = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var y = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    var m = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : csize;
    var n = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : csize;
    // Param: `L`ayer, `c`olor, `x`, `y`, `m`, `n`.
    if (c) ui.ctx[L].fillStyle = _color[c];
    ui.raw(L, c, x, y, m, n);
  },
  clear_image: function clear_image(L, x, y, p) {
    p = p.trim().split("\n");
    ui.clear(L, null, x, y, p[0].length, p.length);
  },
  clear_all: function clear_all() {
    layers.map(function (L) {
      return ui.clear(L);
    });
  }
};
var test = {
  font: function font() {
    ui.clear("ui", null, 0, 80);
    ui.text("ui", 1, 80, Object.keys(_font[_font.family]).join("").replace(/[^]{17}/g, "$&\n"));
  },
  color: function color() {
    ui.clear("ui", null, 0, 80);
    var i = 0;

    for (var _i = 0, _Object$keys = Object.keys(_color); _i < _Object$keys.length; _i++) {
      var c = _Object$keys[_i];
      ui.text("ui", 1 + i++ * 6, 80, c, c, " ");
    }
  }
};
var stage = {
  title: function title() {
    ui.text("ui", 1, 1, "TRAIN PROBLEM", "#");
    ui.text("ui", 1, 7, "<<<< EMULATOR", "!");
  },
  author: function author() {
    ui.text("ui", 1, 19, "@", "@");
    ui.text("ui", 7, 19, "FORKΨKILLET", "#");
    ui.text("ui", 13, 25, "GITHUB:FORKFG/TPE", "@").reg_name("github", function () {
      return open("https://github.com/ForkFG/TrainProblemEmulator");
    });
  },
  menu: function menu() {
    ui.text("ui", 13, 37, "[ START ]", "+").reg_name("start", stage.start, stage.init);
    ui.text("ui", 13, 43, "[ TEST:FONT ]", "+").reg_name("test:font", test.font);
    ui.text("ui", 13, 49, "[ TEST:COLOR ]", "+").reg_name("test:color", test.color);
    ui.text("ui", 13, 55, "[ FUN:TPGOD ]", "=").reg_name("fun:tpgod", function () {
      ui.clear("ui");
      tpgod.place(10, 10).move(0, 0, 0, 0);
      route.timeout(function () {
        return tpgod.move(eval("t => " + prompt("dx = t => ...")), eval("t => " + prompt("dy = t => ...")), +prompt("ms"), +prompt("t"));
      }, 1000);
    }, true);
  },
  init: function init() {
    route.push("init");
    ui.clear_all();
    stage.title();
    stage.menu();
    stage.author();
    stage.help();
  },
  railway: function railway() {
    [30, 34, 90, 94].forEach(function (y) {
      var d = y % 10;

      for (var x = d ? -4 : 0; x < csize; x += 6) {
        ui.draw("stage", x, y, image.random("railway", 4));
        ui.draw("stage", x, y + (d ? 4 : -1), image["railway_" + (d ? "bottom" : "top")]);
      }
    });
  },
  light: function light(c) {
    ui.draw("stage", 100, 58, image.cat_ex.apply(image, _toConsumableArray(Array.from({
      length: 3
    }, function () {
      return "light";
    })).concat(["light_pole"])).apply(void 0, _toConsumableArray(Array.from({
      length: 3
    }, function (_, k) {
      return {
        L: "!?*"[k] === c ? c : "%"
      };
    }))));
  },
  help: function help() {
    ui.text("ui", 140, 1, "?", "?").reg_name("help", function () {
      ui.clear("ui", null, 0, 80);
      ui.text("ui", 1, 80, _help.init.trim(), "#");
    });
  },
  start: function start() {
    ui.clear("stage");
    ui.clear("ui");
    stage.title();
    stage.railway();
    stage.light("*");
    tpgod.place(0, 60).move(1, 0, 200, 20);
  }
};
var tpgod = {
  move_state: 1,
  place: function place(x, y) {
    // Param: `x`, `y`.
    tpgod.x = x;
    tpgod.y = y;
    return tpgod;
  },
  move: function move(dx, dy, ms, t) {
    // Param: `dx`, `dy`, `m`illi`s`econd, `t`imes.
    var x = tpgod.x,
        y = tpgod.y,
        fx = typeof dx === "function" ? dx(t) : dx,
        fy = typeof dy === "function" ? dy(t) : dy;
    ui.draw("move", tpgod.x, tpgod.y, image.cat("tpgod_head", "tpgod_body", "tpgod_tentacle_" + tpgod.move_state));
    if (t) route.timeout(function () {
      ui.clear("move", " ", x - fx, y - fy, 17, 22);
      tpgod.move_state = 3 - tpgod.move_state;
      tpgod.x += fx;
      tpgod.y += fy;
      tpgod.move(dx, dy, ms, t - 1);
    }, ms);
    return tpgod;
  }
};

var player = /*#__PURE__*/function () {
  function player(look) {
    _classCallCheck(this, player);

    this.look = _objectSpread({}, look);
    this.bind_state = 0;
  }

  _createClass(player, [{
    key: "place",
    value: function place(r, i) {
      // Param: `r`ailway, `i`ndex.
      this.r = r;
      this.i = i;
      this.y = r ? 85 : 25;
      this.x = 15 * i;
      return this;
    }
  }, {
    key: "appear",
    value: function appear() {
      if ([this.x, this.y].includes()) return;
      ui.draw("move", this.x, this.y, image.cat_ex("player_head_citizen_overlook", "player_body_overlook")({
        _: 10,
        S: this.look.skin,
        E: this.look.eyes,
        M: this.look.mouth
      }, {
        C: this.look.cloth
      }));
      return this;
    }
  }, {
    key: "disappear",
    value: function disappear() {
      ui.clear("move", null, this.x - 1, this.y, 20, 12);
      return this;
    }
  }, {
    key: "bind",
    value: function bind() {
      var _this = this;

      route.interval(function () {
        _this.disappear().appear();

        _this.bind_state++;
        if (_this.bind_state === 5) _this.bind_state = 1;
        ui.draw("move", _this.x - 1, _this.y + 5, image["ground_tentacle_" + _this.bind_state]);
      }, 900);
      return this;
    }
  }]);

  return player;
}();

if (location.protocol === "file:") window.debug = {
  route: route,
  ui: ui,
  test: test,
  stage: stage,
  tpgod: tpgod,
  player: player,
  csize: csize,
  layers: layers,
  color: _color,
  font: _font,
  image: image
};
window.onload = stage.init;

window.onkeyup = function (e) {
  var _route$now2;

  var d;

  switch (e.key) {
    case "Enter":
    case " ":
      (_route$now2 = route.now) === null || _route$now2 === void 0 ? void 0 : _route$now2.f();
      return;

    case "j":
    case "ArrowDown":
      d = 1;
      break;

    case "k":
    case "ArrowUp":
      d = -1;
      break;

    case "?":
      route.top.focus = route.find("help");
      return;

    case "r":
      location.reload();
      return;

    case "C":
      ui.clear_all();
      return;

    case "Delete":
    case "Backspace":
    case "h":
    case "ArrowLeft":
      route.pop();
      return;

    default:
      return;
  }

  var l = route.top.length;
  var f = route.top.focus;
  if (!l) return;
  if (d) f = f === null ? 0 : f + d;
  if (f === -1) f = l - 1;
  if (f === l) f = 0;
  route.top.focus = f;
};

ui.ctx.ui.canvas.onclick = function (e) {
  var x = e.offsetX,
      y = e.offsetY;
  x /= 5;
  y /= 5;
  route.top.forEach(function (b, i) {
    var dx = x - b.x,
        dy = y - b.y;

    if (dx >= 0 && dx <= b.m && dy >= 0 && dy <= b.n) {
      if (route.top.focus === i) b.f();else route.top.focus = i;
    }
  });
};
},{"./resource":2}],2:[function(require,module,exports){
const color = {

"#": "black",
"!": "red",
".": "ivory",
"?": "yellow",
"@": "cornflowerblue",
"+": "forestgreen",
"*": "chartreuse",
"%": "lightgrey",
"/": "grey",
" ": "white",
"=": "sienna",
"-": "transparent",

}

const font = {

icelava: {

"A": `
 ### 
#   #
#####
#   #
#   #
`,

"B": `
#### 
#   #
#### 
#   #
#### 
`,

"C": `
 ####
#    
#    
#    
 ####
`,

"D": `
#### 
#   #
#   #
#   #
#### 
`,

"E": `
#####
#    
#### 
#    
#####
`,

"F": `
#####
#    
#### 
#    
#    
`,

"G": `
 ####
#    
# ###
#   #
 ####
`,

"H": `
#   #
#   #
#####
#   #
#   #
`,

"I": `
#####
  #  
  #  
  #  
#####
`,

"J": `
#####
   # 
   # 
#  # 
 ##  
`,

"K": `
#  ##
# #  
##   
# #  
#  ##
`,

"L": `
#    
#    
#    
#    
#####
`,

"M": `
#   #
## ##
# # #
#   #
#   #
`,

"N": `
#   #
##  #
# # #
#  ##
#   #
`,

"O": `
 ### 
#   #
#   #
#   #
 ### 
`,

"P": `
#### 
#   #
#### 
#    
#    
`,

"Q": `
 ### 
#   #
### #
# #  
 # ##
`,

"R": `
#### 
#   #
#### 
#  # 
#   #
`,

"S": `
 ####
#    
 ### 
    #
#### 
`,

"T": `
#####
  #  
  #  
  #  
  #  
`,

"U": `
#   #
#   #
#   #
#   #
 ### 
`,

"V": `
#   #
#   #
#   #
 # # 
  #  
`,

"W": `
#   #
# # #
# # #
# # #
 # # 
`,

"X": `
#   #
 # # 
  #  
 # # 
#   #
`,

"Y": `
#   #
 # # 
  #  
  #  
  #  
`,

"Z": `
#####
   # 
  # 
 #   
#####
`,

"0": `
#### 
#  # 
#  # 
#  # 
#### 
`,

"1": `
#    
#    
#    
#    
#    
`,

"2": `
#### 
   # 
#### 
#    
#### 
`,

"3": `
#### 
   # 
#### 
   # 
#### 
`,

"4": `
#  # 
#  # 
#### 
   # 
   # 
`,

"5": `
#### 
#    
#### 
   # 
#### 
`,

"6": `
#### 
#    
#### 
#  # 
#### 
`,

"7": `
#### 
   # 
  ## 
   # 
   # 
`,

"8": `
#### 
#  # 
#### 
#  # 
#### 
`,

"9": `
#### 
#  # 
#### 
   # 
#### 
`,

" ": `
     
     
     
     
     
`,

".": `
     
     
     
     
 #   
`,

",": `
     
     
     
 #   
#    
`,

"!": `
  #  
  #  
  #  
     
  #  
`,

"?": `
#####
    #
  ## 
     
  #  
`,

"#": `
 # # 
#####
 # # 
#####
 # # 
`,

"/": `
    #
   # 
  #  
 #   
#    
`,

"\\": `
#     
 #   
  #  
   # 
    #
`,

"|": `
  #  
  #  
  #  
  #  
  #  
`,

"+": `
     
  #  
 ### 
  #  
     
`,

"-": `
     
     
 ### 
     
     
`,

"_": `
     
     
     
     
 ### 
`,

"=": `
     
 ### 
     
 ### 
     
`,

"*": `
     
 # # 
  #  
 # # 
     
`,

":": `
     
 #   
     
 #   
     
`,

";": `
     
 #   
     
 #   
#    
`,

"@": `
#### 
    #
 ## #
# # #
## ##
`,

"%": `
##  #
#  # 
  #  
 #  #
#  ##
`,

"$": `
 ####
# #  
 ### 
  # #
#### 
`,

"(": `
  #  
 #   
 #   
 #   
  #  
`,

")": `
  #  
   # 
   # 
   # 
  #  
`,

"[": `
  ## 
  #  
  #  
  #  
  ## 
`,

"]": `
 ##  
  #  
  #  
  #  
 ##  
`,

"<": `
  #  
 #   
#    
 #   
  #  
`,

">": `
  #  
   # 
    #
   # 
  #  
`,

"'": `
   # 
  #  
     
     
     
`,

"\"": `
 # # 
 # # 
     
     
     
`,

"`": `
 #   
  #  
     
     
     
`,

"~": `
 # #
# # 
     
     
     
`,

"^": `
  #  
 # # 
     
     
     
`,

"&": `
 ### 
#  # 
 ### 
#  # 
 ## #
`,

"Ψ": `
# # #
# # #
 ### 
  #  
  #  
`

},

piterator: {

"A": `
  #  
 # # 
#   #
#####
#   #
`,

"B": `
#### 
#   #
#### 
#   #
#### 
`,

"C": `
 ####
#    
#    
#    
 ####
`,

"D": `
#### 
#   #
#   #
#   #
#### 
`,

"E": `
#####
#    
#### 
#    
#####
`,

"F": `
#####
#    
#### 
#    
#    
`,

"G": `
 ### 
#    
# ###
#   #
 ### 
`,

"H": `
#   #
#   #
#####
#   #
#   #
`,

"I": `
 ### 
  #  
  #  
  #  
 ### 
`,

"J": `
 ### 
   # 
   # 
 # # 
  #  
`,

"K": `
#   #
# ## 
##   
# ## 
#   #
`,

"L": `
#    
#    
#    
#    
#####
`,

"M": `
#   #
## ##
# # #
#   #
#   #
`,

"N": `
#   #
##  #
# # #
#  ##
#   #
`,

"O": `
 ### 
#   #
#   #
#   #
 ### 
`,

"P": `
#### 
#   #
#### 
#    
#    
`,

"Q": `
 ### 
#   #
# # #
#  # 
 ## #
`,

"R": `
#### 
#   #
#### 
# #  
#  ##
`,

"S": `
 ####
#    
 ### 
    #
#### 
`,

"T": `
#####
  #  
  #  
  #  
  #  
`,

"U": `
#   #
#   #
#   #
#   #
 ### 
`,

"V": `
#   #
#   #
#   #
 # # 
  #  
`,

"W": `
#   #
# # #
# # #
# # #
 # # 
`,

"X": `
#   #
 # # 
  #  
 # # 
#   #
`,

"Y": `
#   #
 # # 
  #  
  #  
  #  
`,

"Z": `
#####
   # 
  # 
 #   
#####
`,

"0": `
 ### 
#  ##
# # #
##  #
 ### 
`,

"1": `
  #  
 ##  
  #  
  #  
 ### 
`,

"2": `
 ### 
#   #
  ## 
 #   
#####
`,

"3": `
#### 
    #
#### 
    #
#### 
`,

"4": `
   # 
  ## 
 # # 
#####
   # 
`,

"5": `
#####
#    
#### 
    #
#### 
`,

"6": `
 ### 
#    
#### 
#   #
 ### 
`,

"7": `
#####
   # 
  #  
  #  
  #  
`,

"8": `
 ### 
#   #
 ### 
#   #
 ### 
`,

"9": `
 ### 
#   #
 ####
    #
 ### 
`,

" ": `
     
     
     
     
     
`,

".": `
     
     
     
     
 #   
`,

",": `
     
     
     
 #   
#    
`,

"!": `
  #  
  #  
  #  
     
  #  
`,

"?": `
 ####
#   #
  ## 
     
  #  
`,

"#": `
 # # 
#####
 # # 
#####
 # # 
`,

"/": `
    #
   # 
  #  
 #   
#    
`,

"\\": `
#     
 #   
  #  
   # 
    #
`,

"|": `
  #  
  #  
  #  
  #  
  #  
`,

"+": `
     
  #  
 ### 
  #  
     
`,

"-": `
     
     
 ### 
     
     
`,

"_": `
     
     
     
     
#####
`,

"=": `
     
 ### 
     
 ### 
     
`,

"*": `
     
 # # 
  #  
 # # 
     
`,

":": `
     
  #  
     
  #  
     
`,

";": `
     
  #  
     
  #  
 #   
`,

"@": `
 ### 
#   #
# ## 
#    
 ####
`,

"%": `
##  #
#  # 
  #  
 #  #
#  ##
`,

"$": `
 ####
# #  
 ### 
  # #
#### 
`,

"(": `
   # 
  #  
  #  
  #  
   # 
`,

")": `
 #   
  #  
  #  
  #  
 #   
`,

"[": `
  ## 
  #  
  #  
  #  
  ## 
`,

"]": `
 ##  
  #  
  #  
  #  
 ##  
`,

"<": `
   # 
  #  
 #   
  #  
   # 
`,

">": `
 #   
  #  
   # 
  #  
 #   
`,

"'": `
  #  
  #  
     
     
     
`,

"\"": `
 # # 
 # # 
     
     
     
`,

"`": `
 #   
  #  
     
     
     
`,

"~": `
 # #
# # 
     
     
     
`,

"^": `
  #  
 # # 
     
     
     
`,

"&": `
 ##  
#  # 
 ## #
#  # 
 ## #
`,

"Ψ": `
# # #
# # #
 ### 
  #  
  #  
`

}

}

const image = {

railway_top: `
=   ==
######
`,

railway_bottom: `
######
=   ==
`,

railway_1 /* neat */: `
%%%===
%%===%
%===%%
===%%%
`,

railway_2 /* stoneless */: `
% %===
 %===%
%===  
===%% 
`,

railway_3: /* green */ `
 %*===
%++==%
+=== +
==* % 
`,

railway_4: /* suspicious */ `
%%%===
%%=!=%
%===%%
===%%%
`,

light: `
##########
#////////#
#//####//#
#/#LLLL#/#
#/#LLLL#/#
#/#LLLL#/#
#/#LLLL#/#
#//####//#
#////////#
`,

light_pole: `
##########
----##----    
----##----
----##----
----##----
----##----
`,

tpgod_head: `
-----######-----
---##########---
--###!####!###--
--###!####!###--
-##############-
-######!!######-
################
`,

tpgod_body: `
####/#/##/#/####
-###///##///###-
--###//##//###--
--###//////###--
---###////###---
---###////###---
----###//###----
----###//###----
-----######-----
-----######-----
-----######-----
`,

tpgod_tentacle_1: `
-----#-##!---/#--
----//-/  !!#--/#
/--#-#--#--/!----
-#/---/#-/#--!!!-
`,

tpgod_tentacle_2: `
-----#-##!---/--#
----/-//  !!#-#/-
-#-#--#-#--/!-!--
/-/---/#-/#--!-!-
`,

ground_tentacle_1: `
----------------------
----------------------
----------------------
------------/--/------
------/-----------/---
---/---------------/--
--/---------------/---
----/---------/-------
--------/-------------
`,

ground_tentacle_2: `
----------------------
----------------------
------------/--/------
------/-----/--/--/---
---/--/-----------//--
--//--------------//--
--/-/---------/---/---
----/---/-----/-------
--------/-------------
`,

ground_tentacle_3: `
---------------!------
------!-----#--#------
------#-----/--/--#!--
--!#--/-----/--/--/#--
--#/--/-------!---#/--
--//#---!-----#---//--
--/-/---#-----/---/---
----/---/-----/-------
--------/-------------
`,

ground_tentacle_4: `
---------------!------
------!-----#--#------
------#----#/--/-##!--
--!##-/#--#-/-###-/#--
--#/--#-##-##-!--##/--
--//##--!-#--##---//--
--/-/---##----/---/---
----/---/-----/-------
--------/-------------
`,

player_head_citizen: `
----########----
---##########---
---##########---
---##S##S##S#---
--SSSSSSSSSSSS--
--SSSESSSSESSS--
---SSESSSSESS---
---SSESSSSESS---
---SSSSSSSSSS---
----SSSSSSSS----
----SSSMMSSS----
-----SSSSSS-----
`,

player_head_citizen_overlook: `
-------#####-
-----########
----SSSSSSSS-
--SSSESSESSS-
--SSSSSSSS---
-SSSSSSSS----
SSSMMSSS-----
SSSSSS-------
`,

player_body: `
-----######-----
----#-#CC#-#----
----#-#CC#-#----
----#-#CC#-#----
----#-#CC#-#----
----#-#CC#-#----
----#-#CC#-#----
----#-#CC#-#----
----#-####-#----
------#--#------
------#--#------
------#--#------
------#--#------
------#--#------
------#--#------
------#--#------
------#--#------
`,

player_body_overlook: `
---------##CCC#-
-------#-#CCC#-#
------#-#CCC#-#-
-----#-#CCC#-#--
----#-#CCC#-#---
---#-#CCC#-#----
----#####-------
----#--#--------
---#--#---------
--#--#----------
-#--#-----------
#--#------------
`,

arrow_down: `
---####---
---#%%#---
---#%%#---
---#%%#---
---#%%#---
---#%%#---
####%%####
-#%%%%%%#-
--#%%%%#--
---#%%#---
----##----
`,

arrow_up: `
----##----
---#%%#---
--#%%%%#--
-#%%%%%%#-
####%%####
---#%%#---
---#%%#---
---#%%#---
---#%%#---
---#%%#---
---####---
`,

random: (n, m) =>
	image[ n + "_" + (~~ (Math.random() * 100) % m + 1) ],

cat: (...ps) => (Array.isArray(ps[0]) ? ps[0] : ps)
	.map(p => (image[p] ?? p).trim()).join("\n"),
cat_ex: (...ps) => (...ex) => ps.map((p, i) => {
	let s = (image[p] ?? p).trim()
	const e = ex[i] ?? {}
	if (e._) // Note: offset
		s = s.replace(/^/mg, "-".repeat(e._))
	for (let [ f, t ] of Object.entries(e))
		if (f !== "_") s = s.replaceAll(f, t)
	return s
}).join("\n"),

}

module.exports = {
	color, font, image
}

},{}]},{},[1])