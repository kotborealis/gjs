'use strict';

function Graph(settings){
    const self = this;

    let _NODE_ID_GEN = 0;
    let _EDGE_ID_GEN = 0;
    settings = settings || {};

    /**
     * Arrays of nodes and edges
     * @type {Array}
     */
    this.nodesArray=[];
    this.edgesArray=[];

    /**
     * Index of nodes and edges
     * @type {{}}
     */
    this.nodesIndex={};
    this.edgesIndex={};

    /**
     * Node neighbour nodes and edges
     */
    this.nodeNeighbourNodes = {};
    this.nodeNeighbourEdges = {};

    /**
     * Add node/nodes to graph
     * @param {Array|Object} node
     */
    this.addNode = function(node){
        node = Array.isArray(node) ? node : [node];
        node.map((i)=>__addNode(i));
    };
    /**
     * Add edge/edges to graph
     * @param {Array|Object} edge
     */
    this.addEdge = function(edge){
        edge = Array.isArray(edge) ? edge : [edge];
        edge.map((i)=>__addEdge(i));
    };

    this.createNode = function(x,y){
        return __addNode({id:"NODE!!_"+_NODE_ID_GEN++,x,y});
    };
    this.createEdge = function(s,t){
        return __addEdge({id:"EDGE!!_"+_EDGE_ID_GEN++,s,t});
    };

    var __addNode = function(node){
        if(!node.id || (typeof node.id!=='string' && typeof node.id!=='number'))
            throw new Error("Invalid node ID");
        if(self.nodesIndex[node.id])
            throw new Error("Node already exists");

        const _node={};
        _node.label=node.label||"";
        _node.size=node.size||10;
        _node.id = node.id;

        _node.x = node.x||0;
        _node.y = node.y||0;

        _node.active = false;
        _node.highlight = false;

        self.nodesArray.push(_node);
        self.nodesIndex[_node.id]=_node;
        self.nodeNeighbourNodes[_node.id]=[];
        self.nodeNeighbourEdges[_node.id]=[];

        return _node.id;
    };

    var __addEdge = function(edge){
        if(!edge.id || (typeof edge.id!=='string' && typeof edge.id!=='number'))
            throw new Error("Invalid edge ID");
        if(!edge.t || (typeof edge.t!=='string' && typeof edge.t!=='number'))
            throw new Error("Invalid edge Target node");
        if(!edge.s || (typeof edge.s!=='string' && typeof edge.s!=='number'))
            throw new Error("Invalid edge Source node");
        if(!self.nodesIndex[edge.s])
            throw new Error("Edge Source node not exists");
        if(!self.nodesIndex[edge.t])
            throw new Error("Edge Target node not exists");
        if(self.edgesIndex[edge.id])
            throw new Error("Edge already exists");

        const _edge = {};
        _edge.id = edge.id;
        _edge.s = edge.s;
        _edge.t = edge.t;

        self.edgesArray.push(_edge);
        self.edgesIndex[_edge.id]=_edge;

        self.nodeNeighbourNodes[_edge.t].push(_edge.s);
        self.nodeNeighbourEdges[_edge.t].push(_edge.id);

        self.nodeNeighbourNodes[_edge.s].push(_edge.t);
        self.nodeNeighbourEdges[_edge.s].push(_edge.id);

        return _edge.id;
    };

    this.setLayout = function(layout,data){
        for(let i=0;i<self.nodesArray.length;i++){
            const c = layout(i,self.nodesArray.length,data);
            self.nodesArray[i].x = c.x;
            self.nodesArray[i].y = c.y;
            console.log(c);
        }
    };
}
'use strict';
const GAlg={};
GAlg.g={};
'use strict';

function CanvasManager(canvas){
    const self = this;

    if(typeof canvas === 'string')
        canvas = document.getElementById(canvas);
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");

    const _canvas={};

    const _mouse={};
    _mouse.x=0;
    _mouse.y=0;
    _mouse.over=false;
    _mouse.down=false;

    this.canvas.onmousedown=(e)=>{
        _mouse.down=true;
        const {x,y}=canvasCoords(e.clientX,e.clientY);
        this.onmousedown({x,y});
    };
    this.canvas.onmouseup=(e)=>{
        _mouse.down=false;
        const {x,y}=canvasCoords(e.clientX,e.clientY);
        this.onmouseup({x,y});
    };

    this.canvas.onmouseover=()=>_mouse.over=true;
    this.canvas.onmouseout=()=>_mouse.over=false;

    this.canvas.onmousemove=(e)=>{
        if(!_mouse.over)return;

        const {x,y}=canvasCoords(e.clientX,e.clientY);
        const dx = (x - _mouse.x);
        const dy = (y - _mouse.y);

        if(_mouse.down)
            self.ondrag({dx,dy,x,y});
        else
            self.onmousemove({x,y});

        _mouse.x=x;
        _mouse.y=y;
    };

    this.canvas.onclick=()=>{
        self.onclick({x:_mouse.x,y:_mouse.y});
    };

    this.canvas.ondblclick=()=>{
        self.ondblclick({x:_mouse.x,y:_mouse.y});
    };

    const canvasCoords = (_x,_y)=>{
        const x = _x-_canvas.box.left;
        const y = _y-_canvas.box.top;
        return {x,y};
    };

    const _onresize = ()=>{
        self.canvas.width=window.innerWidth;
        self.canvas.height=window.innerHeight;
        _canvas.box=self.canvas.getBoundingClientRect();
    };
    window.onresize=_onresize;
    _onresize();


    /**
     * Events
     */
    this.onmousemove=()=>{};
    this.onclick=()=>{};
    this.ondblclick=()=>{};
    this.ondrag=()=>{};
    this.onmousedown=()=>{};
    this.onmouseup=()=>{};

    /**
     * Methods
     */

    this.clear = (color)=>{
        self.ctx.fillStyle = color;
        self.ctx.fillRect(0,0,self.canvas.width,self.canvas.height);
    };
}
'use strict';

const cameraSettings = {
    viewport:{x:-400,y:-400},
    nodeColor:{
        "":"#DD5A5A",
        "hover":"#4E9999",
        "highlight":"#768DCC"
    },
    bgColor:"#F2F5FC",
    edgeColor:{
        "":"#E87C7C",
        "highlight":"#94A4CC"
    },
    edgeWidth:{
        "":4
    }
};

function Camera(canvasManager,g,cfg){
    cfg=cfg||cameraSettings;

    const ctx = canvasManager.ctx;
    this.viewportOffset={x:0,y:0};

    const redraw = ()=>{
        startRender();
        edgeRender();
        nodeRender();
        endRender();
        requestAnimationFrame(redraw);
    };
    requestAnimationFrame(redraw);

    const startRender = ()=>{
        canvasManager.clear(cfg.bgColor);
        ctx.save();
        ctx.translate(-viewport().x,-viewport().y);
    };

    const endRender = ()=>{
        ctx.restore();
    };

    const nodeRender = ()=>{
        g.nodesArray.map((node)=>{
            ctx.fillStyle=cfg.nodeColor.hasOwnProperty(node.prop)?cfg.nodeColor[node.prop]:cfg.nodeColor[""];
            ctx.beginPath();
            ctx.arc(node.x,node.y,node.size,0,2*Math.PI,false);
            ctx.fill();
            ctx.closePath();
        });
    };

    const edgeRender = ()=>{
        ctx.lineWidth=cfg.edgeWidth[""];
        g.edgesArray.map((edge)=>{
            ctx.strokeStyle=cfg.edgeColor.hasOwnProperty(edge.prop)?cfg.edgeColor[edge.prop]:cfg.edgeColor[""];
            ctx.beginPath();
            ctx.moveTo(g.nodesIndex[edge.s].x,g.nodesIndex[edge.s].y);
            ctx.lineTo(g.nodesIndex[edge.t].x,g.nodesIndex[edge.t].y);
            ctx.stroke();
            ctx.closePath();
        });
    };

    const viewport = ()=>{
        const x = cfg.viewport.x-this.viewportOffset.x;
        const y = cfg.viewport.y-this.viewportOffset.y;
        return {x,y};
    };

    this.viewportCoords = (x,y)=>{
        x = x+viewport().x;
        y = y+viewport().y;
        return {x,y};
    };
}
'use strict';

function Gjs(canvas,nodes,edges){
    var g = new Graph();
    g.addNode(nodes);
    g.addEdge(edges);
    g.setLayout(circleLayout,{r:150});
    var canvasManager = new CanvasManager(canvas);
    var camera = new Camera(canvasManager,g);

    let hoverNodeId=null;
    let highlightNodeId=[];
    let highlightEdgeId=[];
    let dragNodeId=null;
    let edgeSourceNodeId=null;

    this.layout=(layout,data)=>{
        g.nodesArray.map((node,i)=>{
            const c = layout(i,g.nodesArray.length,data);
            node.x=c.x;
            node.y=c.y;
        });
    };

    const setNodeProp = (id,prop)=>{
        if(id===null)return;
        g.nodesIndex[id].prop=prop;
    };
    const setEdgeProp = (id,prop)=>{
        if(id===null)return;
        g.edgesIndex[id].prop=prop;
    };

    const getNodeIdByCoords = (x,y)=>{
        let nodeId=null;
        const _ = camera.viewportCoords(x,y);
        g.nodesArray.map((node)=>{
            if(_.x >= node.x-node.size && _.x <= node.x+node.size && _.y >= node.y-node.size && _.y <= node.y+node.size)
                nodeId=node.id;
        });
        return nodeId;
    };

    const onNodeHover = (id)=>{
        setNodeProp(hoverNodeId,"");
        setNodeProp(id,"hover");
        hoverNodeId=id;

        highlightNodeId.map((_id)=>setNodeProp(_id));
        highlightNodeId=[];
        highlightEdgeId.map((_id)=>setEdgeProp(_id));
        highlightEdgeId=[];

        if(id===null)return;

        g.nodeNeighbourNodes[id].map((_id)=>{
            setNodeProp(_id,"highlight");
            highlightNodeId.push(_id);
        });

        g.nodeNeighbourEdges[id].map((_id)=>{
            setEdgeProp(_id,"highlight");
            highlightEdgeId.push(_id);
        });
    };

    const onNodeDrag = (id,dx,dy)=>{
        g.nodesIndex[id].x+=dx;
        g.nodesIndex[id].y+=dy;
    };

    const onViewportDrag = (dx,dy)=>{
        camera.viewportOffset.x+=dx;
        camera.viewportOffset.y+=dy;
    };

    canvasManager.onmousemove=(e)=>{
        onNodeHover(getNodeIdByCoords(e.x,e.y));
    };

    canvasManager.ondrag=(e)=>{
        if(dragNodeId===null)
            onViewportDrag(e.dx,e.dy);
        else
            onNodeDrag(dragNodeId,e.dx,e.dy);
    };

    canvasManager.onmousedown=(e)=>{
        dragNodeId=getNodeIdByCoords(e.x,e.y);
    };

    canvasManager.onmouseup=()=>{
        dragNodeId=null;
    };

    canvasManager.ondblclick=(e)=>{
        const id = getNodeIdByCoords(e.x,e.y);
        if(id===null){
            const _=camera.viewportCoords(e.x,e.y);
            const newNode = g.createNode(_.x,_.y);
            if(edgeSourceNodeId===null)
                edgeSourceNodeId=newNode;
            else{
                g.createEdge(edgeSourceNodeId,newNode);
                edgeSourceNodeId=null;
            }
        }
        else {
            if (edgeSourceNodeId === null)
                edgeSourceNodeId = id;
            else {
                g.createEdge(edgeSourceNodeId, id);
                edgeSourceNodeId = null;
            }
        }
    };
}

var circleLayout = function(i,n,data){
    var x=(data.r*Math.cos(i*2*Math.PI/n))>>0;
    var y=(data.r*Math.sin(i*2*Math.PI/n))>>0;
    return {x,y};
};
var gridLayout = function(i,n,data){
    var x=data.r*(i%data.row);
    var y=data.r*((i/data.row )<<0);
    return {x,y};
};
//# sourceMappingURL=build.js.map
