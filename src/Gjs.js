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

    const gjs_interface = {
        clear: () => {
            this.graph = new Graph();
            render.setGraph(this.graph);
            clearHEntities();
        },
        export: () => {
            window.prompt("Graph JSON:", JSON.stringify(this.graph.export()));
        },
        import: () => {
            gjs_interface.clear();
            const imp = window.prompt("Graph JSON:", JSON.stringify({nodes:[],edges:[]}));
            try{
                this.graph.import(JSON.parse(imp));
            }
            catch(e){
                alert("Invalid Graph JSON! "+e.toString());
            }
        },
        export_to_file: () => {
            if(!window.hasOwnProperty('saveAs')){
                console.log('It seems that you don\'t have FileSaver (saveAs) loaded.');
                console.log('But, you can use export and manually save the result to file.');
                return;
            }
            const blob = new Blob([JSON.stringify(this.graph.export())], {type: "application/json;charset=utf-8"});
            saveAs(blob, `graph_${Date.now()}_${this.graph.nodes.size}n_${this.graph.edges.size}e.gjs.json`);
        },
        import_from_file: () => {
            const input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if(!file){
                    return;
                }
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        gjs_interface.clear();
                        this.graph.import(JSON.parse(e.target.result));
                    }
                    catch(e){
                        alert("Invalid Graph JSON! "+e.toString());
                    }
                };
                reader.readAsText(file);
            }, false);
            input.click();
        }
    };

    window.gjs_interface = gjs_interface;

    if(window.hasOwnProperty('dat') && dat.GUI) {
        const gui = new dat.GUI();
        gui.add(gjs_interface, 'clear');
        gui.add(gjs_interface, 'export');
        gui.add(gjs_interface, 'export_to_file');
        gui.add(gjs_interface, 'import');
        gui.add(gjs_interface, 'import_from_file');
    }
    else{
        console.log('It seems that you don\'t have dat.gui loaded.');
        console.log('But, you can use window.gjs_interface');
        console.log('gjs_interface:',['clear', 'export', 'export_to_file', 'import', 'import_from_file']);
    }
};

