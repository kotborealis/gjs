"use strict";

const Graph = require('./Graph');
const CanvasManager = require('./CanvasManager');
const GraphRender = require('./GraphRender');

module.exports.Gjs = function(canvas_selector) {
    this.graph = new Graph();

    const canvas = new CanvasManager(canvas_selector, {fullscreen: true, enableDrag: true});
    const render = new GraphRender.Render(canvas, this.graph);

    const hEntities = { //highlighted entities
        nodes: {
            hover: null,
            drag: null
        },
        edges: {
            hover: new Set()
        }
    };

    const getNodeByCoords = (x, y) => {
        let node = null;
        const v = render.toViewport(x, y);
        this.graph.nodes.forEach(_node => {
            const size = render.getConfig().node[_node.render.state].size;
            const c = {x: _node.render.x, y: _node.render.y};
            if(v.x >= c.x - size && v.x <= c.x + size && v.y >= c.y - size && v.y <= c.y + size)
                node = _node;
        });
        return node;
    };

    const onNodeHover = node => {
        if(node === hEntities.nodes.hover) {
            return;
        }
        if(hEntities.nodes.hover){
            hEntities.nodes.hover.render.state = "";
        }

        hEntities.nodes.hover = node;

        if(hEntities.nodes.hover) {
            hEntities.nodes.hover.render.state = "hover";

            hEntities.nodes.hover.meta.sourceOf.forEach(edge => {
                hEntities.edges.hover.add(edge);
                edge.render.state = "out";
            });
            hEntities.nodes.hover.meta.targetOf.forEach(edge => {
                hEntities.edges.hover.add(edge);
                edge.render.state = "in";
            });
        }
        else{
            hEntities.edges.hover.forEach(edge => {
                edge.render.state = "";
            });
            hEntities.edges.hover.clear();
        }
    };

    const onNodeDrag = (node, dx, dy) => {
        node.render.x += dx;
        node.render.y += dy;
    };

    const onViewportDrag = (dx, dy) => {
        render.viewportOffset.x += dx;
        render.viewportOffset.y += dy;
    };

    if(canvas) {
        canvas.onmousemove = e => {
            onNodeHover(getNodeByCoords(e.x, e.y));
        };

        canvas.onmousedown = e => {
            hEntities.nodes.drag = getNodeByCoords(e.x, e.y);
        };

        canvas.onmouseup = () => {
            hEntities.nodes.drag = null;
        };

        canvas.onclick = () => {
        };

        canvas.ondrag = e => {
            if (!hEntities.nodes.drag) {
                onViewportDrag(e.dx / render.zoom(), e.dy / render.zoom());
            }
            else {
                onNodeDrag(hEntities.nodes.drag, e.dx / render.zoom(), e.dy / render.zoom());
            }
        };

        canvas.onmousewheel = (e)=> {
            render.zoom(e.deltaY);
        };
    }
};
