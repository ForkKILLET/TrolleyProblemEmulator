(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var _require = require("./resource"),
    psize = _require.psize,
    _color = _require.color,
    _font = _require.font,
    image = _require.image;

var csize = 600 / psize;
var layers = ["stage", "move", "ui"];
var button = Object.assign([], {
  focus: null,
  find: function find(n) {
    return button.findIndex(function (b) {
      return b.n === n;
    });
  },
  kill: function kill(n) {
    var i = button.find(n);
    if (i === -1) return;
    button.splice(i, 1);
    if (button.focus === i) ui.clear_prompt();
    if (button.focus > i) button.focus--;
  },
  kill_all: function kill_all() {
    ui.clear_prompt();
    button.length = 0;
    button.focus = null;
  }
});
var _help = {
  init: "\n[ J / DOWN ]\n  FOCUS NEXT\n[ K / UP ]\n  FOCUS PREVIOUS\n[ ? ]\n  FOCUS ?\n[ SPACE / ENTER ]\n  ACTIVE\n[ R ]\n  REFRESH\n[ C ] !\n  CLEAR ALL\n"
};
var ui = {
  ctx: layers.reduce(function (acc, L) {
    acc[L] = document.getElementById(L).getContext("2d");
    return acc;
  }, {}),
  draw: function draw(L, x, y, p) {
    if (typeof p === "string") p = p.split("\n");
    p = p.filter(function (s, k) {
      return k !== 0 && k !== p.length - 1 || s !== "";
    });

    for (var r = 0; r < p.length; r++) {
      for (var c = 0; c < p[r].length; c++) {
        ui.ctx[L].fillStyle = _color[p[r][c]];
        ui.ctx[L].fillRect((x + c) * psize, (y + r) * psize, psize, psize);
      }
    }
  },
  text: function text(L, x, y, t) {
    var fc = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "#";
    var bc = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : "-";
    var gx = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 6;
    var gy = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 6;
    if (typeof t === "string") t = t.split("\n");

    for (var r = 0; r < t.length; r++) {
      for (var c = 0; c < t[r].length; c++) {
        var f = _font[t[r][c]];
        if (fc || bc) f = f.replaceAll("#", "{").replaceAll(" ", "}").replaceAll("{", fc).replaceAll("}", bc);
        ui.draw(L, x + c * gx, y + r * gy, f);
      }
    }

    return {
      reg: function reg(f) {
        return button.push({
          f: f,
          x: x - 12,
          y: y
        });
      },
      reg_name: function reg_name(n, f) {
        if (button.find(n) === -1) button.push({
          n: n,
          f: f,
          x: x - 12,
          y: y
        });
      }
    };
  },
  clear: function clear(L, c) {
    var x = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var y = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    var m = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : csize;
    var n = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : csize;
    if (c) ui.ctx[L].fillStyle = _color[c !== null && c !== void 0 ? c : " "];
    ui.ctx[L][c ? "fillRect" : "clearRect"](x * psize, y * psize, m * psize, n * psize);
  },
  clear_all: function clear_all() {
    layers.map(function (L) {
      return ui.clear(L);
    });
  },
  prompt: function prompt() {
    if (button.focus === null) return;
    var b = button[button.focus];
    ui.text("ui", b.x, b.y, ">>", "+");
  },
  clear_prompt: function clear_prompt(b) {
    if (button.focus === null) return;

    var _ref = b !== null && b !== void 0 ? b : button[button.focus],
        x = _ref.x,
        y = _ref.y;

    ui.clear("ui", null, x, y, 11, 5);
  }
};
var test = {
  font: function font() {
    ui.clear("ui");
    ui.text("ui", 1, 1, Object.keys(_font).join("").replace(/[^]{17}/g, "$&\n"));
  },
  color: function color() {
    ui.clear("ui");
    ui.clear("stage", "%");
    var i = 0;

    for (var _i = 0, _Object$keys = Object.keys(_color); _i < _Object$keys.length; _i++) {
      var c = _Object$keys[_i];
      ui.text("ui", 1 + i++ * 6, 1, c, c, " ");
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
    ui.text("ui", 13, 37, "[ START ]", "+").reg_name("start", stage.start);
    ui.text("ui", 13, 43, "[ TEST:FONT ]", "+").reg_name("test:font", function () {
      test.font();
      button.kill("github");
      button.kill("help");
      stage.menu();
    });
    ui.text("ui", 13, 49, "[ TEST:COLOR ]", "+").reg_name("test:color", function () {
      test.color();
      button.kill("github");
      button.kill("help");
      stage.menu();
    });
    ui.text("ui", 13, 55, "[ FUN:TPGOD ]", "=").reg_name("fun:tpgod", function () {
      ui.clear("ui");
      button.kill_all();
      tpgod.appear(10, 10).move(0, 0, 0, 0);
      setTimeout(function () {
        return tpgod.move(eval("t => " + prompt("dx = t => ...")), eval("t => " + prompt("dy = t => ...")), +prompt("ms"), +prompt("t"));
      }, 1000);
    });
    ui.prompt();
  },
  init: function init() {
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
    ui.text("ui", 100, 1, "?", "?").reg_name("help", function () {
      ui.clear("ui");
      ui.text("ui", 1, 1, _help.init, "#");
    });
  },
  start: function start() {
    ui.clear("stage");
    ui.clear("ui");
    button.kill_all();
    stage.title();
    stage.railway();
    stage.light("*");
    tpgod.appear(0, 60).move(1, 0, 200, 20);
  }
};
var tpgod = {
  move_state: 1,
  appear: function appear(x, y) {
    tpgod.x = x;
    tpgod.y = y;
    return tpgod;
  },
  move: function move(dx, dy, ms, t) {
    var x = tpgod.x,
        y = tpgod.y,
        fx = typeof dx === "function" ? dx(t) : dx,
        fy = typeof dy === "function" ? dy(t) : dy;
    ui.draw("move", tpgod.x, tpgod.y, image.cat("tpgod_head", "tpgod_body", "tpgod_tentacle_" + tpgod.move_state));
    if (t) setTimeout(function () {
      ui.clear("move", " ", x - fx, y - fy, 16, 22);
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
  }

  _createClass(player, [{
    key: "place",
    value: function place(r, i) {
      ui.draw("move", 15 * i, r ? 85 : 25, image.cat_ex("player_head_citizen_overlook", "player_body_overlook")({
        _: 10,
        S: this.look.skin,
        E: this.look.eyes,
        M: this.look.mouth
      }, {
        C: this.look.cloth
      }));
    }
  }]);

  return player;
}();

if (location.protocol === "file:") window.debug = {
  button: button,
  ui: ui,
  test: test,
  stage: stage,
  tpgod: tpgod,
  player: player,
  csize: csize,
  layers: layers,
  psize: psize,
  color: _color,
  font: _font,
  image: image
};
window.onload = stage.init;

window.onkeyup = function (e) {
  var d;

  switch (e.key) {
    case "Enter":
    case " ":
      button[button.focus].f();
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
      button.focus = button.find("help");
      break;

    case "R":
    case "r":
      location.reload();
      return;

    case "C":
      ui.clear_all();
      return;

    default:
      return;
  }

  var l = button.length;
  if (!l) return;
  if (button.focus === null) {
    if (d) button.focus = 0;else return;
  } else {
    ui.clear_prompt();
    if (d) button.focus += d;
  }
  if (button.focus === -1) button.focus = l - 1;
  if (button.focus === l) button.focus = 0;
  ui.prompt();
};
},{"./resource":2}],2:[function(require,module,exports){
const psize	= 5

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
 #  #
# ## 
     
     
     
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
------------/--/------
------/-----------/---
---/---------------/--
--/---------------/---
----/---------/-------
--------/-------------
`,

ground_tentacle_2: `
------------#--#------
------#-----/--/--#---
---#--/-----------/#--
--#/--------------#/--
--/-#---------#---/---
----/---#-----/-------
--------/-------------
`,

ground_tentacle_3: `
------------#--#------
------##----/##/-##---
---#--/-#--##---#-/#--
--#/-#-----#-#--###/--
--/-#----##---#---/---
----/---#-----/-------
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
	psize, color, font, image
}


},{}]},{},[1])