/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _Gjs = __webpack_require__(1);
	
	var Gjs = _interopRequireWildcard(_Gjs);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	var gjs = new Gjs.Gjs("#gcanvas");
	
	gjs.graph.addNode([{
		id: 0,
		x: 0,
		y: 0
	}, {
		id: 1,
		x: 100,
		y: 100
	}, {
		id: 2,
		x: 200,
		y: 100
	}, {
		id: 3,
		x: -200,
		y: -300
	}, {
		id: 4,
		x: 200,
		y: 300
	}]);
	
	gjs.graph.addEdge([{
		id: 0,
		s: 0,
		t: 1
	}, {
		id: 1,
		s: 0,
		t: 2
	}, {
		id: 2,
		s: 0,
		t: 3
	}, {
		id: 3,
		s: 0,
		t: 3
	}, {
		id: 4,
		s: 0,
		t: 3
	}, {
		id: 5,
		s: 0,
		t: 3
	}, {
		id: 6,
		s: 0,
		t: 3
	}, {
		id: 7,
		s: 4,
		t: 0
	}]);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.Gjs = undefined;
	
	var _Graph = __webpack_require__(2);
	
	var Graph = _interopRequireWildcard(_Graph);
	
	var _CanvasManager = __webpack_require__(3);
	
	var _CanvasManager2 = _interopRequireDefault(_CanvasManager);
	
	var _GraphRender = __webpack_require__(4);
	
	var GraphRender = _interopRequireWildcard(_GraphRender);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	var Gjs = exports.Gjs = function Gjs(canvas_selector) {
	    var _this = this;
	
	    this.graph = new Graph.Graph();
	
	    var canvas = new _CanvasManager2.default(canvas_selector, { fullscreen: true, enableDrag: true });
	    var render = new GraphRender.Render(canvas, this.graph);
	
	    var hEntities = { //highlighted entities
	        nodes: {
	            hover: null,
	            drag: null
	        },
	        edges: {
	            hover: new Set()
	        }
	    };
	
	    var getNodeByCoords = function getNodeByCoords(x, y) {
	        var node = null;
	        var v = render.toViewport(x, y);
	        _this.graph.nodes.forEach(function (_node) {
	            var size = render.getConfig().node[_node.render.state].size;
	            var c = { x: _node.render.x, y: _node.render.y };
	            if (v.x >= c.x - size && v.x <= c.x + size && v.y >= c.y - size && v.y <= c.y + size) node = _node;
	        });
	        return node;
	    };
	
	    var onNodeHover = function onNodeHover(node) {
	        if (node === hEntities.nodes.hover) {
	            return;
	        }
	        if (hEntities.nodes.hover) {
	            hEntities.nodes.hover.render.state = "";
	        }
	
	        hEntities.nodes.hover = node;
	
	        if (hEntities.nodes.hover) {
	            hEntities.nodes.hover.render.state = "hover";
	
	            hEntities.nodes.hover.meta.sourceOf.forEach(function (edge) {
	                hEntities.edges.hover.add(edge);
	                edge.render.state = "out";
	            });
	            hEntities.nodes.hover.meta.targetOf.forEach(function (edge) {
	                hEntities.edges.hover.add(edge);
	                edge.render.state = "in";
	            });
	        } else {
	            hEntities.edges.hover.forEach(function (edge) {
	                edge.render.state = "";
	            });
	            hEntities.edges.hover.clear();
	        }
	    };
	
	    var onNodeDrag = function onNodeDrag(node, dx, dy) {
	        node.render.x += dx;
	        node.render.y += dy;
	    };
	
	    var onViewportDrag = function onViewportDrag(dx, dy) {
	        render.viewportOffset.x += dx;
	        render.viewportOffset.y += dy;
	    };
	
	    canvas.onmousemove = function (e) {
	        onNodeHover(getNodeByCoords(e.x, e.y));
	    };
	
	    canvas.onmousedown = function (e) {
	        hEntities.nodes.drag = getNodeByCoords(e.x, e.y);
	    };
	
	    canvas.onmouseup = function () {
	        hEntities.nodes.drag = null;
	    };
	
	    canvas.ondrag = function (e) {
	        if (!hEntities.nodes.drag) {
	            onViewportDrag(e.dx / render.zoom(), e.dy / render.zoom());
	        } else {
	            onNodeDrag(hEntities.nodes.drag, e.dx / render.zoom(), e.dy / render.zoom());
	        }
	    };
	
	    canvas.onmousewheel = function (e) {
	        render.zoom(e.deltaY);
	    };
	};

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var Graph = exports.Graph = function Graph() {
	    var _this = this;
	
	    this.nodes = new Set();
	    this.edges = new Set();
	
	    this.nodesIndex = new Map();
	    this.edgesIndex = new Map();
	
	    this.edgeBySourceTarget = new Map();
	
	    this.addNode = function (node) {
	        Array.isArray(node) ? node.forEach(addNodeHelper) : addNodeHelper(node);
	    };
	
	    var addNodeHelper = function addNodeHelper(node) {
	        if (node.id === undefined) throw new Error("Node must have an id");
	        if (_this.nodesIndex.has(node.id.toString())) throw new Error("Node with id " + node_obj.id + " already exists");
	
	        var node_obj = {
	            id: node.id.toString(),
	            render: {
	                x: node.x || 0,
	                y: node.y || 0,
	                state: ""
	            },
	            meta: {
	                targetOf: new Set(),
	                sourceOf: new Set(),
	                neighbourNodes: new Set(),
	                neighbourEdges: new Set()
	            }
	        };
	
	        _this.edgeBySourceTarget.set(node_obj, new Map());
	
	        _this.nodes.add(node_obj);
	        _this.nodesIndex.set(node_obj.id, node_obj);
	    };
	
	    this.addEdge = function (edge) {
	        Array.isArray(edge) ? edge.forEach(addEdgeHelper) : addEdgeHelper(edge);
	    };
	
	    var addEdgeHelper = function addEdgeHelper(edge) {
	        if (edge.id === undefined) throw new Error("Edge must have an id");
	        if (_this.edgesIndex.has(edge.id.toString())) throw new Error("Edge already exists");
	        if (edge.s === undefined || edge.t === undefined) throw new Error("Edge must have source and target");
	        if (!_this.nodesIndex.has(edge.s.toString()) || !_this.nodesIndex.has(edge.t.toString())) throw new Error("Edge target/source node does not exists");
	
	        var edge_obj = {
	            id: edge.id.toString(),
	            s: _this.nodesIndex.get(edge.s.toString()),
	            t: _this.nodesIndex.get(edge.t.toString()),
	            weight: Number.isNaN(Number(edge.weight)) ? Number.POSITIVE_INFINITY : Number(edge.weight),
	            render: {
	                state: ""
	            }
	        };
	
	        edge_obj.s.meta.sourceOf.add(edge_obj);
	        edge_obj.t.meta.targetOf.add(edge_obj);
	
	        edge_obj.s.meta.neighbourNodes.add(edge_obj.t);
	        edge_obj.s.meta.neighbourEdges.add(edge_obj);
	
	        _this.edgeBySourceTarget.get(edge_obj.s).set(edge_obj.t, edge_obj);
	
	        _this.edges.add(edge_obj);
	        _this.edgesIndex.set(edge_obj.id, edge_obj);
	    };
	
	    this.getEdgeBySourceTarget = function (node_s, node_t) {
	        return _this.edgeBySourceTarget.get(node_s).get(node_t);
	    };
	};

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';
	/**
	 * CanvasManager class
	 * @param canvas - Canvas element or selector
	 * @param options - Options (fullscreen,width,height,enableDrag)
	 * @constructor
	 */
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	exports.default = function (canvas) {
	    var _this = this;
	
	    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	
	    if (canvas === undefined) throw new Error("CanvasManager first argument must be canvas element or selector");
	    if (options === undefined) options = {};
	
	    /**
	     * Default options
	     */
	    options.fullscreen = options.fullscreen || false;
	    options.width = options.width || 800;
	    options.height = options.height || 600;
	    options.enableDrag = options.enableDrag || false;
	
	    /**
	     * Canvas initialization
	     */
	    if (typeof canvas === 'string') this.e_canvas = document.querySelector(canvas);else if (this.e_canvas === null) {
	        this.e_canvas = document.createElement('canvas');
	        document.body.appendChild(this.e_canvas);
	    } else this.e_canvas = canvas;
	
	    this.e_canvas.width = options.width;
	    this.e_canvas.height = options.height;
	    this.ctx = this.e_canvas.getContext("2d");
	    this.canvas = {};
	
	    window.onresize = function () {
	        if (options.fullscreen) {
	            _this.e_canvas.width = window.innerWidth;
	            _this.e_canvas.height = window.innerHeight;
	            _this.width = _this.e_canvas.width;
	            _this.height = _this.e_canvas.width;
	        } else {
	            _this.e_canvas.width = options.width;
	            _this.e_canvas.height = options.height;
	            _this.width = _this.e_canvas.width;
	            _this.height = _this.e_canvas.width;
	        }
	        _this.clear();
	        _this.onresize();
	    };
	    this.onresize = function () {};
	    setTimeout(function () {
	        return window.onresize();
	    }, 0);
	
	    /**
	     * Mouse Events
	     */
	    this.onmousemove = function (e) {};
	    this.onclick = function (e) {};
	    this.ondblclick = function (e) {};
	    this.ondrag = function (e) {};
	    this.onmousedown = function (e) {};
	    this.onmouseup = function (e) {};
	    this.onmousewheel = function (e) {};
	    this.onmouseover = function (e) {};
	    this.onmouseout = function (e) {};
	
	    /**
	     * Mouse State
	     */
	    this.mouse = {};
	    this.mouse.x = 0;
	    this.mouse.y = 0;
	    this.mouse.over = false;
	    this.mouse.down = false;
	    this.mouse.button = null;
	
	    /**
	     * Mouse Handlers
	     */
	    this.e_canvas.addEventListener('mousedown', function (e) {
	        _this.mouse.down = true;
	        _this.mouse.button = e.button;
	
	        var _canvasCoords = canvasCoords(e.clientX, e.clientY);
	
	        var x = _canvasCoords.x;
	        var y = _canvasCoords.y;
	
	        _this.onmousedown({ button: e.button, x: x, y: y });
	    });
	    this.e_canvas.addEventListener('mouseup', function (e) {
	        _this.mouse.down = false;
	
	        var _canvasCoords2 = canvasCoords(e.clientX, e.clientY);
	
	        var x = _canvasCoords2.x;
	        var y = _canvasCoords2.y;
	
	        _this.onmouseup({ button: e.button, x: x, y: y });
	    });
	    this.e_canvas.addEventListener('mouseover', function () {
	        _this.mouse.over = true;
	        _this.onmouseover();
	    });
	    this.e_canvas.addEventListener('mouseout', function () {
	        _this.mouse.over = false;
	        _this.onmouseout();
	    });
	    this.e_canvas.addEventListener('mousemove', function (e) {
	        if (!_this.mouse.over) return;
	
	        var _canvasCoords3 = canvasCoords(e.clientX, e.clientY);
	
	        var x = _canvasCoords3.x;
	        var y = _canvasCoords3.y;
	
	        var dx = x - _this.mouse.x;
	        var dy = y - _this.mouse.y;
	        if (_this.mouse.down && options.enableDrag) _this.ondrag({ button: _this.mouse.button, dx: dx, dy: dy, x: x, y: y });else _this.onmousemove({ x: x, y: y });
	        _this.mouse.x = x;
	        _this.mouse.y = y;
	    });
	    this.e_canvas.addEventListener('click', function (e) {
	        _this.onclick({ button: e.button, x: _this.mouse.x, y: _this.mouse.y });
	    });
	    this.e_canvas.addEventListener('dblclick', function (e) {
	        _this.ondblclick({ button: e.button, x: _this.mouse.x, y: _this.mouse.y });
	    });
	    this.e_canvas.addEventListener('mousewheel', function (e) {
	        _this.onmousewheel(e);
	    });
	
	    /**
	     * Keyboard Events
	     */
	    this.onkeydown = function () {};
	    this.onkeyup = function () {};
	
	    /**
	     * Keyboard State
	     */
	    this.keyboard = {};
	    this.keyboard.altKey = false;
	    this.keyboard.ctrlKey = false;
	    this.keyboard.shiftKey = false;
	
	    /**
	     * Keyboard Handlers
	     */
	    window.addEventListener('keydown', function (e) {
	        _this.keyboard.altKey = e.altKey;
	        _this.keyboard.shiftKey = e.shiftKey;
	        _this.keyboard.ctrlKey = e.ctrlKey;
	        _this.onkeydown({ altKey: e.altKey, shiftKey: e.shiftKey, ctrlKey: e.ctrlKey, keyCode: e.keyCode });
	    });
	    window.addEventListener('keyup', function (e) {
	        _this.keyboard.altKey = e.altKey;
	        _this.keyboard.shiftKey = e.shiftKey;
	        _this.keyboard.ctrlKey = e.ctrlKey;
	        _this.onkeyup({ altKey: e.altKey, shiftKey: e.shiftKey, ctrlKey: e.ctrlKey, keyCode: e.keyCode });
	    });
	
	    /**
	     * Methods
	     */
	    this.clear = function () {
	        var color = arguments.length <= 0 || arguments[0] === undefined ? "#000000" : arguments[0];
	
	        _this.ctx.fillStyle = color;
	        _this.ctx.fillRect(0, 0, _this.e_canvas.width, _this.e_canvas.height);
	    };
	    var canvasCoords = function canvasCoords(_x, _y) {
	        var x = _x - _this.e_canvas.getBoundingClientRect().left;
	        var y = _y - _this.e_canvas.getBoundingClientRect().top;
	        return { x: x, y: y };
	    };
	
	    Object.defineProperty(this, "fullscreen", {
	        get: function get() {
	            return options.fullscreen;
	        },
	        set: function set(v) {
	            options.fullscreen = v;window.onresize();
	        }
	    });
	};

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.Render = undefined;
	
	var _CanvasManager = __webpack_require__(3);
	
	var _CanvasManager2 = _interopRequireDefault(_CanvasManager);
	
	var _Graph = __webpack_require__(2);
	
	var Graph = _interopRequireWildcard(_Graph);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var config = {
		viewport: { x: -400, y: -400 },
		edge: {
			"": {
				color: "#607D8B",
				width: 4
			},
			"hover": {
				color: "#9C27B0",
				width: 4
			},
			"out": {
				color: "#EF6C00",
				width: 4
			},
			"in": {
				color: "#F9A825",
				width: 4
			}
		},
		node: {
			"": {
				color: "#607D8B",
				size: 8
			},
			"hover": {
				color: "#9C27B0",
				size: 8
			}
		},
		multipleEdgesOffset: 20,
		edgeArrow: { x: 10, y: 10 }
	};
	
	var Render = exports.Render = function Render(canvasManager, graph) {
		var _this = this;
	
		if (!(canvasManager instanceof _CanvasManager2.default)) throw new Error("First argument of GraphRender.Render must be CanvasManager instance");
		if (!(graph instanceof Graph.Graph)) throw new Error("Second argument of GraphRender.Render must be Graph.Graph instance");
	
		this.config = Object.assign({}, config);
	
		var ctx = canvasManager.ctx;
	
		this.viewportOffset = { x: 0, y: 0 };
	
		var zoomFactor = 1;
		var drawedEdgesBySourceTarget = void 0;
	
		var render = function render() {
			renderStart();
			renderEdges();
			renderNodes();
			renderEnd();
	
			requestAnimationFrame(render);
		};
	
		var renderStart = function renderStart() {
			canvasManager.clear("#ECEFF1");
			ctx.save();
			ctx.scale(zoomFactor, zoomFactor);
			var v = calculateViewport();
			ctx.translate(-v.x, -v.y);
		};
	
		var renderEnd = function renderEnd() {
			ctx.restore();
		};
	
		var renderEdges = function renderEdges() {
			drawedEdgesBySourceTarget = new Map();
	
			ctx.font = "16px monospace";
	
			graph.edges.forEach(renderEdge);
		};
	
		var renderEdge = function renderEdge(edge) {
			var state = edge.render.state;
	
			var desiredOffset = 0;
	
			if (drawedEdgesBySourceTarget.has(edge.s) && drawedEdgesBySourceTarget.get(edge.s).has(edge.t)) desiredOffset = drawedEdgesBySourceTarget.get(edge.s).get(edge.t).size;
	
			if (!drawedEdgesBySourceTarget.has(edge.s)) drawedEdgesBySourceTarget.set(edge.s, new Map());
			if (!drawedEdgesBySourceTarget.get(edge.s).has(edge.t)) drawedEdgesBySourceTarget.get(edge.s).set(edge.t, new Set());
			drawedEdgesBySourceTarget.get(edge.s).get(edge.t).add(edge);
	
			ctx.lineWidth = config.edge[state].width;
			ctx.strokeStyle = ctx.fillStyle = config.edge[state].color;
	
			var s = { x: edge.s.render.x, y: edge.s.render.y };
			var t = { x: edge.t.render.x, y: edge.t.render.y };
	
			var dist = Math.sqrt(Math.pow(t.x - s.x, 2) + Math.pow(t.y - s.y, 2));
			var angle = Math.atan2(t.y - s.y, t.x - s.x);
			var offset = {
				x: dist / 2,
				y: desiredOffset * config.multipleEdgesOffset
			};
	
			ctx.save();
			ctx.translate(s.x, s.y);
			ctx.rotate(angle);
			ctx.beginPath();
			ctx.moveTo(0, 0);
			ctx.bezierCurveTo(offset.x, offset.y, offset.x, offset.y, dist, 0);
			ctx.stroke();
			ctx.closePath();
	
			ctx.beginPath();
			ctx.moveTo(dist - config.edgeArrow.x, 0);
			ctx.lineTo(dist - config.edgeArrow.x * 2, -config.edgeArrow.y);
			ctx.moveTo(dist - config.edgeArrow.x, 0);
			ctx.lineTo(dist - config.edgeArrow.x * 2, config.edgeArrow.y);
			ctx.stroke();
			ctx.closePath();
	
			var edgeText = edge.weight === Number.POSITIVE_INFINITY ? "inf" : edge.weight;
			if (angle < -Math.PI / 2 || angle > Math.PI / 2) {
				ctx.save();
				ctx.rotate(Math.PI);
				ctx.fillText(edgeText, -offset.x, -offset.y - 5);
				ctx.restore();
			} else ctx.fillText(edgeText, offset.x, offset.y - 5);
	
			ctx.restore();
		};
	
		var renderNodes = function renderNodes() {
			graph.nodes.forEach(renderNode);
		};
	
		var renderNode = function renderNode(node) {
			ctx.fillStyle = config.node[node.render.state].color;
	
			ctx.beginPath();
			ctx.arc(node.render.x, node.render.y, config.node[node.render.state].size, 0, 2 * Math.PI, false);
			ctx.fill();
			ctx.closePath();
	
			var font_size = config.node[node.render.state].size + 5;
			var offset = -font_size / 2;
			ctx.font = font_size + "px monospace";
			ctx.fillText(node.id, node.render.x + config.node[node.render.state].size, node.render.y + offset);
		};
	
		var calculateViewport = function calculateViewport() {
			var x = (config.viewport.x - _this.viewportOffset.x) / zoomFactor;
			var y = (config.viewport.y - _this.viewportOffset.y) / zoomFactor;
			return { x: x, y: y };
		};
	
		this.toViewport = function (x, y) {
			var v = calculateViewport();
			x = x / zoomFactor + v.x;
			y = y / zoomFactor + v.y;
			return { x: x, y: y };
		};
	
		this.getConfig = function () {
			return _this.config;
		};
	
		this.zoom = function (dy) {
			if (dy === undefined) return zoomFactor;else zoomFactor = zoomFactor - dy / (2000 / zoomFactor);
		};
	
		render();
	};

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map