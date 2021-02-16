(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = require("./resource"),
    psize = _require.psize,
    _color = _require.color,
    _font = _require.font,
    image = _require.image;

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
    button.length = 0;
    button.focus = null;
    ui.clear_prompt();
  }
});
var ui = {
  board: " ",
  size: 600 / psize,
  ctx: ["stage", "move", "ui"].reduce(function (acc, L) {
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
    var m = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : ui.size;
    var n = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : ui.size;
    if (c !== "--") ui.ctx[L].fillStyle = _color[c !== null && c !== void 0 ? c : " "];
    ui.ctx[L][c === "--" ? "clearRect" : "fillRect"](x * psize, y * psize, m * psize, n * psize);
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

    ui.clear("ui", "--", x, y, 11, 5);
  }
};
var test = {
  font: function font() {
    ui.clear("stage");
    ui.text("stage", 1, 1, Object.keys(_font).join("").replace(/[^]{17}/g, "$&\n"));
  },
  color: function color() {
    ui.clear("stage", "%");
    var i = 0;

    for (var _i = 0, _Object$keys = Object.keys(_color); _i < _Object$keys.length; _i++) {
      var c = _Object$keys[_i];
      ui.text("stage", 1 + i++ * 6, 1, c, c, " ");
    }
  }
};
var stage = {
  title: function title() {
    ui.text("stage", 1, 1, "TRAIN PROBLEM", "#");
    ui.text("stage", 1, 7, "<<<< EMULATOR", "!");
  },
  author: function author() {
    ui.text("stage", 1, 19, "@", "@");
    ui.text("stage", 7, 19, "FORKΨKILLET", "#");
    ui.text("stage", 13, 25, "GITHUB:FORKFG/TPE", "@").reg_name("github", function () {
      return open("https://github.com/ForkFG/TrainProblemEmulator");
    });
  },
  menu: function menu() {
    ui.text("stage", 13, 37, "[ START ]", "+").reg_name("start", stage.start);
    ui.text("stage", 13, 43, "[ TEST:FONT ]", "+").reg_name("test:font", function () {
      test.font();
      button.kill("github");
      button.kill("help");
      stage.menu();
    });
    ui.text("stage", 13, 49, "[ TEST:COLOR ]", "+").reg_name("test:color", function () {
      test.color();
      button.kill("github");
      button.kill("help");
      stage.menu();
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

      for (var x = d ? -4 : 0; x < ui.size; x += 6) {
        ui.draw("stage", x, y, image.random("railway", 4));
        ui.draw("stage", x, y + (d ? 4 : -1), image["railway_" + (d ? "bottom" : "top")]);
      }
    });
  },
  light: function light(c) {
    [1, 2, 3].forEach(function (i) {
      return ui.draw("stage", 100, 48 + i * 9, image.light.replaceAll(" ", {
        "!": 1,
        "?": 2,
        "*": 3
      }[c] === i ? c : "%"));
    });
    ui.draw("stage", 100, 48 + 4 * 9, image.light_pole);
  },
  help: function help() {
    ui.text("stage", 100, 1, "?", "?").reg_name("help", function () {
      ui.text("stage", 100, 1, "N/A", "#", " ");
    });
  },
  start: function start() {
    ui.clear("stage");
    button.kill_all();
    stage.title();
    stage.railway();
    stage.light("*");
    god.move(0, 60, 1, 0, 200, 20);
  }
};
var god = {
  move_state: 1,
  move: function move(x, y, dx, dy, ms, t) {
    ui.draw("move", x, y, image.god_head.trim() + image.god_body + image["god_tentacle_" + god.move_state].trim());
    t && setTimeout(function () {
      ui.clear("move", " ", x - dx, y - dy, 16, 22);
      god.move_state = 3 - god.move_state;
      god.move(x + dx, y + dy, dx, dy, ms, t - 1);
    }, ms);
  }
};

var player = function player() {
  _classCallCheck(this, player);
};

if (location.protocol === "file:") window.debug = {
  ui: ui,
  test: test,
  stage: stage,
  psize: psize,
  color: _color,
  font: _font,
  image: image
};
window.onload = stage.init;

window.onkeyup = function (e) {
  var l = button.length;
  if (!l) return;
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

    default:
      return;
  }

  if (button.focus === null) {
    if (d) button.focus = 0;else return;
  } else {
    ui.clear_prompt();
    button.focus += d;
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
#/#    #/#
#/#    #/#
#/#    #/#
#/#    #/#
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

god_head: `
-----######-----
---##########---
--###!####!###--
--###!####!###--
-##############-
-######!!######-
################
`,

god_body: `
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

god_tentacle_1: `
-----#-##!---/#--
----//-/  !!#--/#
/--#-#--#--/!----
-#/---/#-/#--!!!-
`,

god_tentacle_2: `
-----#-##!---/--#
----/-//  !!#-#/-
-#-#--#-#--/!-!--
/-/---/#-/#--!-!-
`

}

image.random = (n, m) =>
	image[ n + "_" + (~~ (Math.random() * 100) % m + 1) ]

module.exports = {
	psize, color, font, image
}


},{}]},{},[1])