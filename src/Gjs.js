"use strict";

import * as Graph from './Graph';
import CanvasManager from './CanvasManager';
import * as GraphRender from './GraphRender';

export const Gjs = function(canvas_selector) {
    this.graph = new Graph.Graph();

    const canvas = new CanvasManager(canvas_selector, {fullscreen: true});
    const render = new GraphRender.Render(canvas, this.graph);

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

    let nodeHover = null;
    const onNodeHover = node => {
        if(node === nodeHover) {
            return;
        }
        if(nodeHover){
            nodeHover.render.state = "";
        }
        nodeHover = node;
        if(nodeHover) nodeHover.render.state = "hover";
    };

    canvas.onmousemove = (e)=> {
        onNodeHover(getNodeByCoords(e.x, e.y));
    };

    canvas.onmousewheel = (e)=> {
        render.zoom(e.deltaY);
    };
};
