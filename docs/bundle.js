(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _require = require("./resource"),
    psize = _require.psize,
    _color = _require.color,
    _font = _require.font;

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
    if (button.focus > i) button.focus--;
  },
  kill_all: function kill_all() {
    button.length = 0;
    button.focus = null;
  }
});
var ui = {
  board: " ",
  ctx: document.getElementById("game").getContext("2d"),
  draw: function draw(x, y, p) {
    if (typeof p === "string") p = p.split("\n");
    p = p.filter(function (s, k) {
      return k !== 0 && k !== p.length - 1 || s !== "";
    });

    for (var r = 0; r < p.length; r++) {
      for (var c = 0; c < p[r].length; c++) {
        ui.ctx.fillStyle = _color[p[r][c]];
        ui.ctx.fillRect((x + c) * psize, (y + r) * psize, psize, psize);
      }
    }
  },
  text: function text(x, y, t) {
    var fc = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "#";
    var bc = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "-";
    var gx = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 6;
    var gy = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 6;
    if (typeof t === "string") t = t.split("\n");

    for (var r = 0; r < t.length; r++) {
      for (var c = 0; c < t[r].length; c++) {
        var f = _font[t[r][c]];
        if (fc || bc) f = f.replaceAll("#", "{").replaceAll(" ", "}").replaceAll("{", fc).replaceAll("}", bc);
        ui.draw(x + c * gx, y + r * gy, f);
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
  clear: function clear(c) {
    ui.board = c !== null && c !== void 0 ? c : " ";
    ui.ctx.fillStyle = _color[ui.board];
    ui.ctx.fillRect(0, 0, 600, 600);
  },
  prompt: function prompt() {
    if (button.focus === null) return;
    var n = button[button.focus];
    ui.text(n.x, n.y, ">>", "+");
  }
};
var test = {
  font: function font() {
    ui.clear();
    ui.text(1, 1, Object.keys(_font).join("").replace(/[^]{17}/g, "$&\n"));
  },
  color: function color() {
    ui.clear("%");
    var i = 0;

    for (var _i = 0, _Object$keys = Object.keys(_color); _i < _Object$keys.length; _i++) {
      var c = _Object$keys[_i];
      ui.text(1 + i++ * 6, 1, c, c, " ");
    }
  }
};
var stage = {
  title: function title() {
    ui.text(1, 1, "TRAIN PROBLEM", "#");
    ui.text(1, 7, "<<<< EMULATOR", "!");
  },
  author: function author() {
    ui.text(1, 19, "@", "@");
    ui.text(7, 19, "FORKΨKILLET", "#");
    ui.text(13, 25, "GITHUB:FORKFG/TPE", "@").reg_name("github", function () {
      return open("https://github.com/ForkFG/TrainProblemEmulator");
    });
  },
  menu: function menu() {
    ui.text(13, 37, "[ START ]", "+").reg_name("start", function () {
      ui.clear();
      button.kill_all();
    });
    ui.text(13, 43, "[ TEST:FONT ]", "+").reg_name("test:font", function () {
      test.font();
      button.kill("github");
      stage.menu();
    });
    ui.text(13, 49, "[ TEST:COLOR ]", "+").reg_name("test:color", function () {
      test.color();
      button.kill("github");
      stage.menu();
    });
    ui.prompt();
  },
  init: function init() {
    stage.title();
    stage.author();
    stage.menu();
  }
};
if (location.protocol === "file:") window.debug = {
  ui: ui,
  test: test,
  stage: stage
};
window.onload = stage.init;

window.onkeyup = function (e) {
  var l = button.length;
  if (!l) return;
  var o = button[button.focus];
  var d;

  switch (e.code) {
    case "Enter":
    case "Space":
      o.f();
      return;

    case "ArrowDown":
      d = 1;
      break;

    case "ArrowUp":
      d = -1;
      break;

    default:
      return;
  }

  if (button.focus === null) {
    if (d) button.focus = 0;else return;
  } else {
    ui.text(o.x, o.y, "  ", null, ui.board);
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
"@": "cornflowerblue",
"+": "forestgreen",
"%": "lightgrey",
" ": "white",
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

module.exports = {
	psize, color, font
}


},{}]},{},[1])