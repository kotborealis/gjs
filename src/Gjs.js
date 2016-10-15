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
            drag: null,
            createEdgeSource: null
        },
        edges: {
            hover: new Set()
        }
    };

    const clearHEntities = () => {
        hEntities.nodes.hover = null;
        hEntities.nodes.drag = null;
        hEntities.nodes.createEdgeSource = null;
        hEntities.edges.hover = new Set();
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

    canvas.onmousemove = (e) => {
        onNodeHover(getNodeByCoords(e.x, e.y));
    };

    canvas.ondblclick = (e) => {
        const node = getNodeByCoords(e.x, e.y);
        if(!node){
            this.graph.addNode(render.toViewport(e.x, e.y));
        }
        else if(!hEntities.nodes.createEdgeSource){
            hEntities.nodes.createEdgeSource = node;
        }
        else{
            this.graph.addEdge({
                s: hEntities.nodes.createEdgeSource.id,
                t: node.id
            });
            hEntities.nodes.createEdgeSource = null;
        }
    };

    canvas.onmousedown = (e) => {
        hEntities.nodes.drag = getNodeByCoords(e.x, e.y);
    };

    canvas.onmouseup = () => {
        hEntities.nodes.drag = null;
    };

    canvas.onclick = (e) => {

    };

    canvas.ondrag = (e) => {
        if (!hEntities.nodes.drag) {
            onViewportDrag(e.dx, e.dy);
        }
        else {
            onNodeDrag(hEntities.nodes.drag, e.dx / render.zoom(), e.dy / render.zoom());
        }
    };

    canvas.onmousewheel = (e)=> {
        render.zoom(e.deltaY);
    };

    //dat.gui
    const gui = new dat.GUI();
    const g = {
        clear: () => {
            this.graph = new Graph();
            render.setGraph(this.graph);
            clearHEntities();
        },
        export: () => {
            window.prompt("Graph JSON:", JSON.stringify(this.graph.export()));
        },
        import: () => {
            g.clear();
            const imp = window.prompt("Graph JSON:", JSON.stringify({nodes:[],edges:[]}));
            try{
                this.graph.import(JSON.parse(imp));
            }
            catch(e){
                alert("Invalid Graph JSON! "+e.toString());
            }
        }
    };

    gui.add(g, 'clear');
    gui.add(g, 'export');
    gui.add(g, 'import');
};

