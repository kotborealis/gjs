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
	
	var Gjs = __webpack_require__(1);
	var GUI = __webpack_require__(9);
	var gjs = new Gjs("gcanvas");
	gjs.loadFromFile("tests/Basic1.json");
	GUI(gjs);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	module.exports = function (canvas) {
	    var _this = this;
	
	    var utils = __webpack_require__(2);
	    var CanvasManager = __webpack_require__(3);
	    var Camera = __webpack_require__(4);
	    var Graph = __webpack_require__(5);
	    var alg = __webpack_require__(6);
	    var g = new Graph();
	    var canvasManager = new CanvasManager(canvas);
	    var camera = new Camera(canvasManager, g);
	    this.g = g;
	    var hoverNodeId = null;
	    var highlightNodeId = [];
	    var highlightEdgeId = [];
	    var dragNodeId = null;
	    var edgeSourceNodeId = null;
	    var pathFindingNodes = [];
	
	    var specialMarked = {};
	    specialMarked.nodes = [];
	    specialMarked.edges = [];
	
	    //Graph Functions
	    this.loadFromFile = function (file) {
	        utils.loadJsonFromFile(file, function (json) {
	            cleanAllProps();
	            pathFindingNodes = [];
	            dragNodeId = null;
	            edgeSourceNodeId = null;
	            hoverNodeId = null;
	            highlightEdgeId = [];
	            highlightNodeId = [];
	            specialMarked.nodes = [];
	            specialMarked.edges = [];
	            g.clear();
	            if (json.hasOwnProperty("nodes") && json.hasOwnProperty("edges")) {
	                g.addNode(json.nodes);
	                g.addEdge(json.edges);
	            }
	        });
	    };
	
	    var addToPathFinding = function addToPathFinding(id) {
	        if (id === null) return;
	        pathFindingNodes.push(id);
	        if (pathFindingNodes.length === 2) {
	            if (pathFindingNodes[0] !== pathFindingNodes[1]) {
	                cleanAllProps();
	                var trace = alg[_this.pathFinderFunction](g, pathFindingNodes[0], pathFindingNodes[1]);
	                for (var i = 0; i < trace.length; i++) {
	                    var node = trace[i];
	                    setNodeProp(node, "trace", true);
	                    if (i < trace.length - 1) {
	                        var edge = g.getEdgeIdByST(node, trace[i + 1]);
	                        setEdgeProp(edge, "trace", true);
	                    }
	                }
	                setNodeProp(trace[0], "trace_s", true);
	                setNodeProp(trace[trace.length - 1], "trace_t", true);
	            }
	            pathFindingNodes = [];
	        } else if (pathFindingNodes.length > 2) {
	            pathFindingNodes = [];
	        }
	    };
	
	    var searchMinCycle = function searchMinCycle() {
	        var traces = alg.BFSCycle(g);
	        var min_length = Number.POSITIVE_INFINITY;
	        var min_i = -1;
	        for (var i = 0; i < traces.length; i++) {
	            if (traces[i].length < min_length) {
	                min_length = traces[i].length;
	                min_i = i;
	            }
	        }
	        if (min_i === -1) return;
	
	        for (var _i = 0; _i < traces[min_i].length; _i++) {
	            var node = traces[min_i][_i];
	            setNodeProp(node, "cycle", true);
	            if (_i < traces[min_i].length - 1) {
	                var edge = g.getEdgeIdByST(node, traces[min_i][_i + 1]);
	                setEdgeProp(edge, "cycle", true);
	            }
	        }
	    };
	
	    var isBipartite = function isBipartite() {
	        var bipartite = alg.BFSBipartite(g);
	        var trace = bipartite.trace;
	        Object.keys(trace).map(function (id) {
	            setNodeProp(id, trace[id] ? "bipartite1" : "bipartite2", true);
	        });
	        return bipartite;
	    };
	
	    var spanningTreeMin = function spanningTreeMin() {
	        alg.SpanningTreeMin(g).map(function (edge) {
	            return setEdgeProp(edge.id, "spanning_tree", true);
	        });
	    };
	
	    //util functions
	    var setNodeProp = function setNodeProp(id, prop, special) {
	        if (id === null || id === undefined) return;
	        if (specialMarked.nodes.includes(id) && !special) return;
	        g.nodesIndex[id].prop = prop;
	        if (special === true) specialMarked.nodes.push(id);
	    };
	
	    var setEdgeProp = function setEdgeProp(id, prop, special) {
	        if (id === null || id === undefined) return;
	        if (specialMarked.edges.includes(id) && !special) return;
	        g.edgesIndex[id].prop = prop;
	        if (special === true) specialMarked.edges.push(id);
	    };
	
	    var cleanAllProps = function cleanAllProps() {
	        specialMarked.nodes = [];
	        specialMarked.edges = [];
	        g.edgesArray.map(function (edge) {
	            return edge.prop = "";
	        });
	        g.nodesArray.map(function (node) {
	            return node.prop = "";
	        });
	    };
	
	    var getNodeIdByCoords = function getNodeIdByCoords(x, y) {
	        var nodeId = null;
	        var _ = camera.viewportCoords(x, y);
	        g.nodesArray.map(function (node) {
	            if (_.x >= node.x - node.size && _.x <= node.x + node.size && _.y >= node.y - node.size && _.y <= node.y + node.size) nodeId = node.id;
	        });
	        return nodeId;
	    };
	
	    //events
	    var onNodeHover = function onNodeHover(id) {
	        setNodeProp(hoverNodeId, "");
	        setNodeProp(id, "hover");
	        hoverNodeId = id;
	
	        highlightNodeId.map(function (_id) {
	            return setNodeProp(_id);
	        });
	        highlightNodeId = [];
	        highlightEdgeId.map(function (_id) {
	            return setEdgeProp(_id);
	        });
	        highlightEdgeId = [];
	
	        if (id === null) return;
	
	        g.nodeNeighbourNodes[id].map(function (_id) {
	            setNodeProp(_id, "highlight");
	            highlightNodeId.push(_id);
	        });
	
	        g.nodeNeighbourEdges[id].map(function (_id) {
	            setEdgeProp(_id, "highlight");
	            highlightEdgeId.push(_id);
	        });
	
	        g.nodeTargetOf[id].map(function (_id) {
	            if (g.edgesIndex[_id].directed) {
	                setEdgeProp(_id, "highlight2");
	                highlightEdgeId.push(_id);
	                setNodeProp(g.edgesIndex[_id].s, "highlight2");
	                highlightNodeId.push(g.edgesIndex[_id].s);
	            }
	        });
	    };
	
	    var onNodeDrag = function onNodeDrag(id, dx, dy) {
	        g.nodesIndex[id].x += dx;
	        g.nodesIndex[id].y += dy;
	    };
	
	    var onViewportDrag = function onViewportDrag(dx, dy) {
	        camera.viewportOffset.x += dx;
	        camera.viewportOffset.y += dy;
	    };
	
	    canvasManager.onmousemove = function (e) {
	        camera.pointer = canvasManager.mouse;
	        onNodeHover(getNodeIdByCoords(e.x, e.y));
	    };
	
	    canvasManager.ondrag = function (e) {
	        if (dragNodeId === null) onViewportDrag(e.dx, e.dy);else onNodeDrag(dragNodeId, e.dx / camera.zoom(), e.dy / camera.zoom());
	    };
	
	    canvasManager.onmousedown = function (e) {
	        dragNodeId = getNodeIdByCoords(e.x, e.y);
	    };
	
	    canvasManager.onmouseup = function () {
	        dragNodeId = null;
	    };
	
	    canvasManager.onclick = function (e) {
	        cleanAllProps();
	        addToPathFinding(getNodeIdByCoords(e.x, e.y));
	    };
	
	    canvasManager.ondblclick = function (e) {
	        var id = getNodeIdByCoords(e.x, e.y);
	        if (id === null) {
	            var _ = camera.viewportCoords(e.x, e.y);
	            var newNode = g.createNode(_.x, _.y);
	            if (edgeSourceNodeId === null) edgeSourceNodeId = newNode;else {
	                g.createEdge(edgeSourceNodeId, newNode);
	                edgeSourceNodeId = null;
	            }
	        } else {
	            if (edgeSourceNodeId === null) edgeSourceNodeId = id;else {
	                g.createEdge(edgeSourceNodeId, id);
	                edgeSourceNodeId = null;
	            }
	        }
	    };
	
	    canvasManager.onmousewheel = function (e) {
	        camera.zoom(e.deltaY);
	    };
	
	    //Layouts
	    this.setLayout = function (layout, data) {
	        g.nodesArray.map(function (node, i) {
	            var c = layout({
	                nodeId: node.id,
	                nodeIndex: i,
	                nodesLength: g.nodesArray.length,
	                data: data
	            });
	            node.x = c.x;
	            node.y = c.y;
	        });
	    };
	
	    this.layout = {};
	    this.layout.circle = {};
	    this.layout.circle.radius = 150;
	    this.layout.grid = {};
	    this.layout.grid.offset = 70;
	    this.layout.grid.row = 3;
	    this.layout.bipartite = {};
	    this.layout.bipartite.partOffset = 200;
	    this.layout.bipartite.elementOffset = 70;
	    this.layout.bipartite.direction = 'horizontal';
	
	    //Pathfinder
	    this.pathFinderFunction = "BFSPath";
	
	    //GUI
	    this.layoutCircle = function () {
	        return _this.setLayout(circleLayout, _this.layout.circle);
	    };
	    this.layoutGrid = function () {
	        return _this.setLayout(gridLayout, _this.layout.grid);
	    };
	    this.layoutBipartite = function () {
	        var bipartite = isBipartite();
	        if (bipartite.bipartite) {
	            _this.layout.bipartite.leftIndex = 0;
	            _this.layout.bipartite.rightIndex = 0;
	            _this.layout.bipartite.trace = bipartite.trace;
	            _this.setLayout(bipartiteLayout, _this.layout.bipartite);
	        }
	    };
	    this.searchMinCycle = searchMinCycle;
	    this.isBipartite = function () {
	        return alert(isBipartite().bipartite);
	    };
	    this.spanningTreeMin = spanningTreeMin;
	    this.isFlowNetwork = function () {
	        return alert(alg.isFlowNetwork(g));
	    };
	    this.camera = camera;
	    this.saveFile = function () {
	        var data = JSON.stringify({ nodes: g.nodesArray, edges: g.edgesArray });
	        saveAs(new Blob([data], { type: "application/json;charset=utf-8" }), utils.randomString(10) + ".json");
	    };
	};
	
	//layout functions
	var circleLayout = function circleLayout(e) {
	    var x = e.data.radius * Math.cos(e.nodeIndex * 2 * Math.PI / e.nodesLength) >> 0;
	    var y = e.data.radius * Math.sin(e.nodeIndex * 2 * Math.PI / e.nodesLength) >> 0;
	    return { x: x, y: y };
	};
	var gridLayout = function gridLayout(e) {
	    var x = e.data.offset * (e.nodeIndex % e.data.row);
	    var y = e.data.offset * (e.nodeIndex / e.data.row << 0);
	    return { x: x, y: y };
	};
	var bipartiteLayout = function bipartiteLayout(e) {
	    var x = e.data.trace[e.nodeId] ? 0 : e.data.partOffset;
	    var y = e.data.trace[e.nodeId] ? e.data.leftIndex++ * e.data.elementOffset : e.data.rightIndex++ * e.data.elementOffset;
	    if (e.data.direction === 'vertical') {
	        var _ = x;
	        x = y;
	        y = _;
	    }
	    return { x: x, y: y };
	};

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	
	module.exports.loadJsonFromFile = function (file, callback) {
	    var path = location.pathname.split('/');
	    path.pop();
	    path = path.join("/") + "/";
	    module.exports.loadJSonFromURL("http://" + location.host + path + file, callback);
	};
	
	module.exports.loadJSonFromURL = function (url, callback) {
	    var _ = new XMLHttpRequest();
	    _.overrideMimeType("application/json");
	    _.open('GET', url, true);
	    _.onreadystatechange = function () {
	        if (_.readyState == 4 && _.status == "200") {
	            callback(JSON.parse(_.responseText));
	        }
	    };
	    _.send(null);
	};
	
	module.exports.randomString = function (l) {
	    var r = "";
	    while (l--) {
	        r += String.fromCharCode((Math.random() * 25 >> 0) + 65);
	    }
	    return r;
	};

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = function (canvas) {
	    var _this = this;
	
	    var self = this;
	
	    if (typeof canvas === 'string') canvas = document.getElementById(canvas);
	    this.canvas = canvas;
	    this.ctx = this.canvas.getContext("2d");
	
	    var _canvas = {};
	
	    var _mouse = {};
	    _mouse.x = 0;
	    _mouse.y = 0;
	    _mouse.over = false;
	    _mouse.down = false;
	    this.mouse = _mouse;
	
	    this.canvas.onmousedown = function (e) {
	        _mouse.down = true;
	
	        var _canvasCoords = canvasCoords(e.clientX, e.clientY);
	
	        var x = _canvasCoords.x;
	        var y = _canvasCoords.y;
	
	        _this.onmousedown({ x: x, y: y });
	    };
	    this.canvas.onmouseup = function (e) {
	        _mouse.down = false;
	
	        var _canvasCoords2 = canvasCoords(e.clientX, e.clientY);
	
	        var x = _canvasCoords2.x;
	        var y = _canvasCoords2.y;
	
	        _this.onmouseup({ x: x, y: y });
	    };
	
	    this.canvas.onmouseover = function () {
	        return _mouse.over = true;
	    };
	    this.canvas.onmouseout = function () {
	        return _mouse.over = false;
	    };
	
	    this.canvas.onmousemove = function (e) {
	        if (!_mouse.over) return;
	
	        var _canvasCoords3 = canvasCoords(e.clientX, e.clientY);
	
	        var x = _canvasCoords3.x;
	        var y = _canvasCoords3.y;
	
	        var dx = x - _mouse.x;
	        var dy = y - _mouse.y;
	
	        if (_mouse.down) self.ondrag({ dx: dx, dy: dy, x: x, y: y });else self.onmousemove({ x: x, y: y });
	
	        _mouse.x = x;
	        _mouse.y = y;
	    };
	
	    this.canvas.onclick = function () {
	        self.onclick({ x: _mouse.x, y: _mouse.y });
	    };
	
	    this.canvas.ondblclick = function () {
	        self.ondblclick({ x: _mouse.x, y: _mouse.y });
	    };
	
	    this.canvas.addEventListener('mousewheel', function (e) {
	        return self.onmousewheel(e);
	    });
	
	    var canvasCoords = function canvasCoords(_x, _y) {
	        var x = _x - _canvas.box.left;
	        var y = _y - _canvas.box.top;
	        return { x: x, y: y };
	    };
	
	    var _onresize = function _onresize() {
	        self.canvas.width = window.innerWidth;
	        self.canvas.height = window.innerHeight;
	        _canvas.box = self.canvas.getBoundingClientRect();
	    };
	    window.onresize = _onresize;
	    _onresize();
	
	    /**
	     * Events
	     */
	    this.onmousemove = function () {};
	    this.onclick = function () {};
	    this.ondblclick = function () {};
	    this.ondrag = function () {};
	    this.onmousedown = function () {};
	    this.onmouseup = function () {};
	    this.onmousewheel = function () {};
	
	    /**
	     * Methods
	     */
	
	    this.clear = function (color) {
	        self.ctx.fillStyle = color;
	        self.ctx.fillRect(0, 0, self.canvas.width, self.canvas.height);
	    };
	};

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";
	
	var cameraSettings = {
	    viewport: { x: -400, y: -400 },
	    nodeColor: {
	        "": "#DD5A5A",
	        "hover": "#4E9999",
	        "highlight": "#768DCC",
	        "highlight2": "#76DDAC",
	        "trace": "#CE44F4",
	        "trace_s": "#5021CC",
	        "trace_t": "#CC1205",
	        "cycle": "#A1F69B",
	        "bipartite1": "#FF5600",
	        "bipartite2": "#0065FF"
	    },
	    bgColor: "#F2F5FC",
	    edgeColor: {
	        "": "#E87C7C",
	        "highlight": "#94A4CC",
	        "highlight2": "#94D4AC",
	        "trace": "#CE44F4",
	        "cycle": "#A1F69B",
	        "spanning_tree": "#26ca8f"
	    },
	    edgeWidth: {
	        "": 4
	    },
	    multipleEdgeOffset: 20,
	    arrowOffset: {
	        x: 10,
	        y: 10
	    }
	};
	
	module.exports = function (canvasManager, g, cfg) {
	    var _this = this;
	
	    cfg = cfg || cameraSettings;
	
	    var _slow_render = localStorage.getItem("slowRender");
	
	    var ctx = canvasManager.ctx;
	    this.viewportOffset = { x: 0, y: 0 };
	
	    var zoomFactor = 1;
	
	    var drawedEdgesByST = {};
	
	    var redraw = function redraw() {
	        startRender();
	        edgeRender();
	        nodeRender();
	        endRender();
	        if (_slow_render !== null) setTimeout(function () {
	            return requestAnimationFrame(redraw);
	        }, _slow_render);else requestAnimationFrame(redraw);
	    };
	    requestAnimationFrame(redraw);
	
	    var startRender = function startRender() {
	        canvasManager.clear(cfg.bgColor);
	        ctx.save();
	        ctx.scale(zoomFactor, zoomFactor);
	        ctx.translate(-viewport().x, -viewport().y);
	    };
	
	    var endRender = function endRender() {
	        ctx.restore();
	    };
	
	    var nodeRender = function nodeRender() {
	        g.nodesArray.map(function (node) {
	            ctx.fillStyle = cfg.nodeColor.hasOwnProperty(node.prop) ? cfg.nodeColor[node.prop] : cfg.nodeColor[""];
	            ctx.beginPath();
	            ctx.arc(node.x, node.y, node.size, 0, 2 * Math.PI, false);
	            ctx.fill();
	            ctx.closePath();
	
	            var font_size = node.size + 5;
	            var offset = -font_size / 2;
	            ctx.font = font_size + "px monospace";
	            ctx.fillStyle = "#0c0c0c";
	            if (_this.options.display.label === true && node.label !== "") {
	                ctx.fillText(node.label, node.x + node.size, node.y + offset);
	                offset = offset + font_size;
	            }
	            if (_this.options.display.id === true) {
	                ctx.fillText(node.id, node.x + node.size, node.y + offset);
	                offset = offset + font_size;
	            }
	            if (_this.options.display.value === true) ctx.fillText(JSON.stringify(node.value), node.x + node.size, node.y + offset);
	        });
	    };
	
	    var edgeRender = function edgeRender() {
	        drawedEdgesByST = {};
	        ctx.lineWidth = cfg.edgeWidth[""];
	        ctx.font = "16px monospace";
	        ctx.fillStyle = "#0c0c0c";
	        g.edgesArray.map(function (edge) {
	            var offsetI = [edge.s, edge.t].sort();
	            drawedEdgesByST[offsetI] = drawedEdgesByST[offsetI] || [];
	            if (drawedEdgesByST[offsetI].indexOf(edge.id) < 0) drawedEdgesByST[offsetI].push(edge.id);
	            drawEdge(edge, offsetI);
	        });
	    };
	
	    var drawEdge = function drawEdge(edge, offsetI) {
	        var cOffset = drawedEdgesByST[offsetI].indexOf(edge.id);
	        var s = { x: g.nodesIndex[edge.s].x, y: g.nodesIndex[edge.s].y };
	        var t = { x: g.nodesIndex[edge.t].x, y: g.nodesIndex[edge.t].y };
	        var distance = Math.sqrt(Math.pow(t.x - s.x, 2) + Math.pow(t.y - s.y, 2));
	        var angle = Math.atan2(t.y - s.y, t.x - s.x);
	        var offset = { x: distance / 2, y: cOffset * cfg.multipleEdgeOffset };
	        ctx.strokeStyle = cfg.edgeColor.hasOwnProperty(edge.prop) ? cfg.edgeColor[edge.prop] : cfg.edgeColor[""];
	        ctx.save();
	        ctx.translate(s.x, s.y);
	        ctx.rotate(angle);
	        ctx.beginPath();
	        ctx.moveTo(0, 0);
	        ctx.bezierCurveTo(offset.x, offset.y, offset.x, offset.y, distance, 0);
	        ctx.stroke();
	        ctx.closePath();
	        if (edge.directed) {
	            ctx.beginPath();
	            ctx.moveTo(distance - cfg.arrowOffset.x, 0);
	            ctx.lineTo(distance - cfg.arrowOffset.x * 2, -cfg.arrowOffset.y);
	            ctx.moveTo(distance - cfg.arrowOffset.x, 0);
	            ctx.lineTo(distance - cfg.arrowOffset.x * 2, cfg.arrowOffset.y);
	            ctx.stroke();
	            ctx.closePath();
	        }
	        if (_this.options.display.weight === true) {
	            var edgeText = edge.weight === Number.POSITIVE_INFINITY ? "inf" : edge.weight;
	            if (angle < -Math.PI / 2 || angle > Math.PI / 2) {
	                ctx.save();
	                ctx.rotate(Math.PI);
	                ctx.fillText(edgeText, -offset.x, -offset.y);
	                ctx.restore();
	            } else ctx.fillText(edgeText, offset.x, offset.y);
	        }
	        ctx.restore();
	    };
	
	    var viewport = function viewport() {
	        var x = (cfg.viewport.x - _this.viewportOffset.x) / zoomFactor;
	        var y = (cfg.viewport.y - _this.viewportOffset.y) / zoomFactor;
	        return { x: x, y: y };
	    };
	
	    this.zoom = function (dy) {
	        if (dy === undefined) return zoomFactor;else zoomFactor = zoomFactor - dy / (2000 / zoomFactor);
	    };
	
	    this.viewportCoords = function (x, y) {
	        x = x / zoomFactor + viewport().x;
	        y = y / zoomFactor + viewport().y;
	        return { x: x, y: y };
	    };
	
	    //GUI vars
	    this.options = {};
	    this.options.display = {};
	    this.options.display.id = true;
	    this.options.display.label = true;
	    this.options.display.value = true;
	    this.options.display.weight = true;
	};

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = function (settings) {
	    var _this = this;
	
	    var _NODE_ID_GEN = 0;
	    var _EDGE_ID_GEN = 0;
	    settings = settings || {};
	
	    /**
	     * Arrays of nodes and edges
	     * @type {Array}
	     */
	    this.nodesArray = [];
	    this.edgesArray = [];
	
	    /**
	     * Index of nodes and edges
	     * @type {{}}
	     */
	    this.nodesIndex = {};
	    this.edgesIndex = {};
	
	    /**
	     * Node neighbour nodes and edges
	     */
	    this.nodeNeighbourNodes = {};
	    this.nodeNeighbourEdges = {};
	
	    /**
	     * Node's edges by targer/source
	     */
	    this.nodeTargetOf = {};
	    this.nodeSourceOf = {};
	
	    /**
	     * Add node/nodes to graph
	     * @param {Array|Object} node
	     */
	    this.addNode = function (node) {
	        node = Array.isArray(node) ? node : [node];
	        node.map(function (i) {
	            return __addNode(i);
	        });
	    };
	    /**
	     * Add edge/edges to graph
	     * @param {Array|Object} edge
	     */
	    this.addEdge = function (edge) {
	        edge = Array.isArray(edge) ? edge : [edge];
	        edge.map(function (i) {
	            return __addEdge(i);
	        });
	    };
	
	    this.createNode = function (x, y) {
	        return __addNode({ id: "NODE!!_" + _NODE_ID_GEN++, x: x, y: y });
	    };
	    this.createEdge = function (s, t) {
	        return __addEdge({ id: "EDGE!!_" + _EDGE_ID_GEN++, s: s, t: t });
	    };
	
	    this.getEdgeIdByST = function (source, target) {
	        for (var i = 0; i < _this.nodeNeighbourEdges[source].length; i++) {
	            var id = _this.nodeNeighbourEdges[source][i];
	            var edge = _this.edgesIndex[id];
	            if (edge.s === source && edge.t === target || edge.t === source && edge.s === target) return id;
	        }
	        return null;
	    };
	
	    this.clear = function () {
	        _this.nodesArray = [];
	        _this.edgesArray = [];
	        _this.nodesIndex = {};
	        _this.edgesIndex = {};
	        _this.nodeNeighbourNodes = {};
	        _this.nodeNeighbourEdges = {};
	        _this.nodeTargetOf = {};
	        _this.nodeSourceOf = {};
	    };
	
	    this.getAdjacencyMatrix = function () {
	        var matrix = [];
	        for (var i = 0; i < _this.nodesArray.length; i++) {
	            matrix[i] = [];
	            for (var j = 0; j < _this.nodesArray.length; j++) {
	                if (_this.nodeNeighbourNodes[_this.nodesArray[i].id].includes(_this.nodesArray[j].id)) matrix[i][j] = 1;else matrix[i][j] = 0;
	            }
	        }
	        return matrix;
	    };
	
	    var __addNode = function __addNode(node) {
	        if (!node.id || typeof node.id !== 'string' && typeof node.id !== 'number') throw new Error("Invalid node ID");
	        if (_this.nodesIndex[node.id]) throw new Error("Node already exists");
	
	        var _node = {};
	        _node.label = node.label || "";
	        _node.size = node.size || 10;
	        _node.id = node.id;
	        _node.value = node.value || {};
	
	        _node.x = node.x || 0;
	        _node.y = node.y || 0;
	
	        _node.active = false;
	        _node.highlight = false;
	
	        _this.nodesArray.push(_node);
	        _this.nodesIndex[_node.id] = _node;
	        _this.nodeNeighbourNodes[_node.id] = [];
	        _this.nodeNeighbourEdges[_node.id] = [];
	        _this.nodeSourceOf[_node.id] = [];
	        _this.nodeTargetOf[_node.id] = [];
	
	        return _node.id;
	    };
	
	    var __addEdge = function __addEdge(edge) {
	        if (!edge.id || typeof edge.id !== 'string' && typeof edge.id !== 'number') throw new Error("Invalid edge ID");
	        if (!edge.t || typeof edge.t !== 'string' && typeof edge.t !== 'number') throw new Error("Invalid edge Target node");
	        if (!edge.s || typeof edge.s !== 'string' && typeof edge.s !== 'number') throw new Error("Invalid edge Source node");
	        if (!_this.nodesIndex[edge.s]) throw new Error("Edge Source node not exists");
	        if (!_this.nodesIndex[edge.t]) throw new Error("Edge Target node not exists");
	        if (_this.edgesIndex[edge.id]) throw new Error("Edge already exists");
	
	        var _edge = {};
	        _edge.id = edge.id;
	        _edge.s = edge.s;
	        _edge.t = edge.t;
	        _edge.weight = edge.weight === undefined ? Number.POSITIVE_INFINITY : edge.weight;
	        _edge.directed = edge.directed || false;
	
	        _this.edgesArray.push(_edge);
	        _this.edgesIndex[_edge.id] = _edge;
	
	        if (!_edge.directed) {
	            _this.nodeNeighbourNodes[_edge.t].push(_edge.s);
	            _this.nodeNeighbourEdges[_edge.t].push(_edge.id);
	        }
	
	        _this.nodeNeighbourNodes[_edge.s].push(_edge.t);
	        _this.nodeNeighbourEdges[_edge.s].push(_edge.id);
	
	        _this.nodeTargetOf[_edge.t].push(_edge.id);
	        _this.nodeSourceOf[_edge.s].push(_edge.id);
	
	        _this.nodeNeighbourNodes[_edge.t].sort();
	        _this.nodeNeighbourEdges[_edge.t].sort();
	
	        _this.nodeNeighbourNodes[_edge.s].sort();
	        _this.nodeNeighbourEdges[_edge.s].sort();
	
	        _this.nodeTargetOf[_edge.t].sort();
	        _this.nodeSourceOf[_edge.s].sort();
	
	        _this.nodesArray.sort(function (a, b) {
	            return a.id.localeCompare(b.id);
	        });
	
	        return _edge.id;
	    };
	};

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var alg = {};
	var BFS = __webpack_require__(7).BFS;
	var BFSTracePath = __webpack_require__(7).BFSTracePath;
	var Dijkstra = __webpack_require__(8).Dijkstra;
	var DijkstraTracePath = __webpack_require__(8).DijkstraTracePath;
	/**
	 * Find shortest path
	 * @param g Graph
	 * @param source Source node
	 * @param target Target node
	 * @returns {[]} Arrays with id's of path nodes
	 * @constructor
	 */
	alg.BFSPath = function (g, source, target) {
	    var found = false;
	    var trace = BFS(g, source, function (e) {
	        if (e.node === target) {
	            found = true;
	            return true;
	        }
	    });
	    if (!trace || !found) return [];
	    return BFSTracePath(g, source, target, trace);
	};
	
	/**
	 * Find some (~all) cycles in graph
	 * @param g Graph
	 * @returns {Array} Array of cycles paths
	 * @constructor
	 */
	alg.BFSCycle = function (g) {
	    var traces = [];
	    for (var i = 0; i < g.nodesArray.length; i++) {
	        var id = g.nodesArray[i].id;
	        var CycleNode = null;
	        var trace = BFS(g, id, function () {}, function (e) {
	            if (e.trace[e.child] !== undefined && e.trace[e.child] >= e.trace[e.node]) {
	                CycleNode = e.child;
	                return true;
	            }
	        });
	
	        if (CycleNode === null) continue;
	
	        var node = CycleNode;
	        var s_trace = [];
	        s_trace.push(node);
	        var backtracing = true;
	        while (backtracing) {
	            for (var _i = 0; _i < Object.keys(trace).length; _i++) {
	                var _id = Object.keys(trace)[_i];
	                if ((trace[_id] === trace[node] - 1 || trace[_id] === trace[node]) && g.getEdgeIdByST(_id, node) !== null) {
	                    if (trace[_id] === 0) backtracing = false;
	                    node = _id;
	                    s_trace.push(node);
	                    break;
	                }
	            }
	        }
	        backtracing = true;
	        var literally_best_possible_solution = ![] + ![];
	        while (backtracing && (literally_best_possible_solution += ![] + !![] + ![]) + ![] < ![] + g.nodesArray.length) {
	            for (var _i2 = 0; _i2 < Object.keys(trace).length; _i2++) {
	                var _id2 = Object.keys(trace)[_i2];
	                if (g.getEdgeIdByST(_id2, node) !== null && (_id2 === CycleNode || trace[_id2] <= trace[CycleNode] && !s_trace.includes(_id2))) {
	                    if (_id2 === CycleNode) backtracing = false;
	                    node = _id2;
	                    s_trace.push(node);
	                    break;
	                }
	            }
	        }
	
	        if (s_trace[0] === s_trace[s_trace.length - 1]) traces.push(s_trace);
	    }
	    return traces;
	};
	
	/**
	 * Determine if graph is bipartite
	 * @param g Graph
	 * @returns {{bipartite: boolean, trace: {}}}
	 * @constructor
	 */
	alg.BFSBipartite = function (g) {
	    var root = g.nodesArray[0].id;
	    var trace = {};
	    trace[root] = true;
	    var result = { bipartite: true, trace: trace };
	    BFS(g, root, function () {}, function (e) {
	        if (trace[e.child] === undefined) trace[e.child] = !trace[e.node];else if (trace[e.node] === trace[e.child]) {
	            result.bipartite = false;
	            return true;
	        }
	    });
	    return result;
	};
	
	/**
	 * Count Connected Components ig graph
	 * @param g Graph
	 * @returns {Number} Number of connected components
	 * @constructor
	 */
	alg.BFSConnectedComponent = function (g) {
	    var visited = [];
	    g.nodesArray.map(function (node) {
	        return visited[node.id] = false;
	    });
	    var count = 0;
	    return alg.BFSConnectedComponentHelper(g, visited, count);
	};
	
	alg.BFSConnectedComponentHelper = function (g, visited, count) {
	    var node = null;
	    for (var i = 0; i < Object.keys(visited).length; i++) {
	        var id = Object.keys(visited)[i];
	        if (visited[id] === false) {
	            node = id;
	            break;
	        }
	    }
	    if (node === null) return count;
	
	    BFS(g, node, function (e) {
	        visited[e.node] = true;return false;
	    }, function () {});
	    return alg.BFSConnectedComponentHelper(g, visited, ++count);
	};
	
	/**
	 * Find shortest path in weighted graph
	 * @param g Graph
	 * @param source Source node
	 * @param target Target node
	 * @returns {[]} Array with id's of path nodes
	 * @constructor
	 */
	alg.DijkstraPath = function (g, source, target) {
	    var trace = Dijkstra(g, source, target);
	    if (!trace) return [];
	    return DijkstraTracePath(g, source, target, trace);
	};
	
	/**
	 * Build minimal spanning tree
	 * @param  g Graph
	 * @return {[]} Array of edges of spanning tree
	 */
	alg.SpanningTreeMin = function (g) {
	    var tree = [];
	    var visited = {};
	    var nodeId = g.nodesArray[0].id;
	
	    var _loop = function _loop() {
	        visited[nodeId] = true;
	        var min_edge = null;
	        Object.keys(visited).map(function (node) {
	            g.nodeNeighbourEdges[node].map(function (_) {
	                var edge = g.edgesIndex[_];
	                if (visited[edge.s] !== true || visited[edge.t] !== true) {
	                    if (min_edge === null || edge.weight < min_edge.weight) min_edge = edge;
	                }
	            });
	        });
	        if (min_edge === null) return "break";else {
	            if (visited[min_edge.s] !== true) nodeId = min_edge.s;else if (visited[min_edge.t] !== true) nodeId = min_edge.t;
	            tree.push(min_edge);
	        }
	    };
	
	    while (true) {
	        var _ret = _loop();
	
	        if (_ret === "break") break;
	    }
	    return tree;
	};
	
	/**
	 * Check if given graph have valid flow
	 * Graph *should* be directed and weighed
	 * @param g
	 */
	alg.isFlowNetwork = function (g) {
	    for (var i = 0; i < g.nodesArray.length; i++) {
	        var node = g.nodesArray[i].id;
	        var sum = 0;
	        g.nodeTargetOf[node].map(function (id) {
	            sum += g.edgesIndex[id].weight;
	        });
	        g.nodeSourceOf[node].map(function (id) {
	            sum += g.edgesIndex[id].weight;
	        });
	        //TODO: Fix second Kirchhoff's law
	        if (sum !== 0) return false;
	    }
	    return true;
	};
	
	module.exports = alg;

/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";
	
	module.exports.BFS = function (g, root, onNode, onChild) {
	    onNode = onNode || function () {};
	    onChild = onChild || function () {};
	    var queue = [];
	    var trace = {};
	
	    queue.push(root);
	    trace[root] = 0;
	
	    while (queue.length) {
	        var node = queue.shift();
	        if (onNode({ trace: trace, node: node }) === true) return trace;
	        for (var i = 0; i < g.nodeNeighbourNodes[node].length; i++) {
	            var child = g.nodeNeighbourNodes[node][i];
	            if (onChild({ trace: trace, node: node, child: child }) === true) return trace;
	            if (trace[child] === undefined) {
	                trace[child] = trace[node] + 1;
	                queue.push(child);
	            }
	        }
	    }
	    return trace;
	};
	
	module.exports.BFSTracePath = function (g, source, target, trace) {
	    var c_node = target;
	    var s_trace = [];
	    s_trace.push(target);
	    while (1) {
	        if (c_node === source) break;
	        for (var i = 0; i < g.nodeNeighbourNodes[c_node].length; i++) {
	            var id = g.nodeNeighbourNodes[c_node][i];
	            if (trace[id] === trace[c_node] - 1) {
	                s_trace.push(id);
	                c_node = id;
	                break;
	            }
	        }
	    }
	    return s_trace.reverse();
	};

/***/ },
/* 8 */
/***/ function(module, exports) {

	"use strict";
	
	module.exports.Dijkstra = function (g, source) {
	    var trace = {};
	    var node_set = [];
	    var visited = {};
	
	    g.nodesArray.map(function (node) {
	        node_set.push(node.id);
	        trace[node.id] = {};
	        trace[node.id].dist = Number.POSITIVE_INFINITY;
	    });
	
	    trace[source].dist = 0;
	    while (node_set.length > 0) {
	        var min_dist = Number.POSITIVE_INFINITY;
	        var min_node_i = 0;
	        var node = null;
	        for (var i = 0; i < Object.keys(trace).length; i++) {
	            var id = Object.keys(trace)[i];
	            if (trace[id].dist < min_dist && visited[id] !== true) {
	                min_dist = trace[id].dist;
	                node = id;
	                min_node_i = i;
	            }
	        }
	        if (node === null) break;
	        visited[node] = true;
	
	        for (var _i = 0; _i < g.nodeNeighbourNodes[node].length; _i++) {
	            var child = g.nodeNeighbourNodes[node][_i];
	            var alt = trace[node].dist + g.edgesIndex[g.getEdgeIdByST(node, child)].weight;
	            if (alt < trace[child].dist) {
	                trace[child].dist = alt;
	                trace[child].prev = node;
	            }
	        }
	    }
	    return trace;
	};
	
	module.exports.DijkstraTracePath = function (g, source, target, trace) {
	    var s_trace = [];
	    var node = target;
	    s_trace.unshift(target);
	    while (trace[node].prev !== undefined) {
	        s_trace.unshift(trace[node].prev);
	        node = trace[node].prev;
	    }
	    return s_trace;
	};

/***/ },
/* 9 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = function (g) {
	    var gui = new dat.GUI();
	
	    window.___ = {};
	    window.___.fileName = "";
	    var fileLoader = gui.add(window.___, 'fileName');
	    fileLoader.onFinishChange(function (fileName) {
	        return g.loadFromFile("tests/" + fileName);
	    });
	
	    var fileLoaderQuickSelect = gui.add(window.___, 'fileName', ["flow1.json", "flow2.json", "sptree1.json", "Basic1.json", "Dijkstra1.json"]);
	    fileLoaderQuickSelect.onFinishChange(function (fileName) {
	        return g.loadFromFile("tests/" + fileName);
	    });
	
	    gui.add(g, 'saveFile');
	    gui.add(g.g, 'clear');
	
	    var options = gui.addFolder("Display");
	    options.add(g.camera.options.display, 'id');
	    options.add(g.camera.options.display, 'label');
	    options.add(g.camera.options.display, 'value');
	    options.add(g.camera.options.display, 'weight');
	
	    var circle_layout = gui.addFolder("Circle Layout");
	    circle_layout.add(g.layout.circle, 'radius', 100, 600);
	    circle_layout.add(g, 'layoutCircle');
	
	    var grid_layout = gui.addFolder("Grid Layout");
	    grid_layout.add(g.layout.grid, 'offset', 50, 500);
	    grid_layout.add(g.layout.grid, 'row', 1, 10).step(1);
	    grid_layout.add(g, 'layoutGrid');
	
	    var bipartite_layout = gui.addFolder("Bipartite Layout");
	    bipartite_layout.add(g.layout.bipartite, 'partOffset', 50, 500);
	    bipartite_layout.add(g.layout.bipartite, 'elementOffset', 50, 500);
	    bipartite_layout.add(g.layout.bipartite, 'direction', ['horizontal', 'vertical']);
	    bipartite_layout.add(g, 'layoutBipartite');
	
	    var pathFinder = gui.addFolder("Path Finder");
	    pathFinder.add(g, 'pathFinderFunction', ["BFSPath", "DijkstraPath"]);
	
	    var funcs = gui.addFolder("Functions");
	    funcs.add(g, 'searchMinCycle');
	    funcs.add(g, 'isBipartite');
	    funcs.add(g, 'spanningTreeMin');
	    funcs.add(g, 'isFlowNetwork');
	};

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map