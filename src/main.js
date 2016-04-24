const Gjs = require("./Gjs.js");
const GUI = require("./ui.js");
const gjs = new Gjs("gcanvas");
gjs.loadFromFile("tests/Basic1.json");
GUI(gjs);