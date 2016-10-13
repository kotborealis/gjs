const CanvasManager = require('./CanvasManager');
const Graph = require('./Graph');

const config = {
	viewport: {x: -400, y: -400},
	edge: {
		"":{
			color: "#607D8B",
			width: 1
		},
        "out":{
            color: "#5C6BC0",
            width: 1
        },
        "in":{
            color: "#42A5F5",
            width: 1
        }
	},
	node: {
		"":{
			color: "#607D8B",
			size: 6
		},
        "hover":{
		    color: "#FF5722",
            size: 6
        }
	},
	multipleEdgesOffset: 15,
	edgeArrow: {x: 6, y: 4}
};

module.exports.Render = function(canvasManager, graph){
	if(!(canvasManager instanceof CanvasManager))
		throw new Error("First argument of GraphRender.Render must be CanvasManager instance");
    if(!(graph instanceof Graph.Graph))
		throw new Error("Second argument of GraphRender.Render must be Graph.Graph instance");

	this.config = Object.assign({}, config);

    const ctx = canvasManager.ctx;

    this.viewportOffset = {x: 0, y: 0};

    let zoomFactor = 1;
    let drawedEdgesBySourceTarget;

    const render = () => {
        renderStart();
        renderEdges();
        renderNodes();
        renderEnd();

        requestAnimationFrame(render);
    };

    const renderStart = () => {
        canvasManager.clear("#ECEFF1");
        ctx.save();
        ctx.scale(zoomFactor, zoomFactor);
        const v = calculateViewport();
        ctx.translate(-v.x, -v.y);
    };

    const renderEnd = () => {
        ctx.restore();
    };

    const renderEdges = () => {
        drawedEdgesBySourceTarget = new Map();

        ctx.font = "16px monospace";

        graph.edges.forEach(renderEdge);
    };

    const renderEdge = edge => {
        const state = edge.render.state;

        let desiredOffset = 0;

        if (drawedEdgesBySourceTarget.has(edge.s)
            && drawedEdgesBySourceTarget.get(edge.s).has(edge.t))
            desiredOffset = drawedEdgesBySourceTarget.get(edge.s).get(edge.t).size;
        if (drawedEdgesBySourceTarget.has(edge.t)
            && drawedEdgesBySourceTarget.get(edge.t).has(edge.s))
            desiredOffset = Math.max(drawedEdgesBySourceTarget.get(edge.t).get(edge.s).size, desiredOffset);

        if (!drawedEdgesBySourceTarget.has(edge.s))
            drawedEdgesBySourceTarget.set(edge.s, new Map());
        if (!drawedEdgesBySourceTarget.get(edge.s).has(edge.t))
            drawedEdgesBySourceTarget.get(edge.s).set(edge.t, new Set());
        drawedEdgesBySourceTarget.get(edge.s).get(edge.t).add(edge);

        ctx.lineWidth = config.edge[state].width;
        ctx.strokeStyle = ctx.fillStyle = config.edge[state].color;

        const s = {x: edge.s.render.x, y: edge.s.render.y};
        const t = {x: edge.t.render.x, y: edge.t.render.y};

        const dist = Math.sqrt(Math.pow(t.x - s.x, 2) + Math.pow(t.y - s.y, 2));
        const angle = Math.atan2(t.y - s.y, t.x - s.x);
        const offset = {
            x: dist / 2,
            y: Math.ceil(desiredOffset / 2) * config.multipleEdgesOffset * (desiredOffset % 2 === 0 ? 1 : -1)
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


        const edgeText = edge.weight === Number.POSITIVE_INFINITY ? "inf" : edge.weight;
        if (angle < -Math.PI / 2 || angle > Math.PI / 2) {
            ctx.save();
            ctx.rotate(Math.PI);
            ctx.fillText(edgeText, -offset.x, -offset.y - 5);
            ctx.restore();
        }
        else
            ctx.fillText(edgeText, offset.x, offset.y - 5);

        ctx.restore();
    };

    const renderNodes = () => {
        graph.nodes.forEach(renderNode);
    };

    const renderNode = node => {
        ctx.fillStyle = config.node[node.render.state].color;

        ctx.beginPath();
        ctx.arc(node.render.x, node.render.y, config.node[node.render.state].size, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.closePath();

        const font_size = config.node[node.render.state].size + 5;
        const offset = -font_size / 2;
        ctx.font = font_size + "px monospace";
        ctx.fillText(node.id, node.render.x + config.node[node.render.state].size, node.render.y + offset);
    };

    const calculateViewport = ()=> {
        const x = (config.viewport.x - this.viewportOffset.x) / zoomFactor;
        const y = (config.viewport.y - this.viewportOffset.y) / zoomFactor;
        return {x, y};
    };

    this.toViewport = (x, y) => {
        const v = calculateViewport();
        x = x / zoomFactor + v.x;
        y = y / zoomFactor + v.y;
        return {x, y};
    };

    this.getConfig = () => this.config;

    this.zoom = dy => {
        if (dy === undefined)
            return zoomFactor;
        else
            zoomFactor = zoomFactor - dy / (2000 / zoomFactor);
    };

    render();
};
