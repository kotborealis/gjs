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

GAlg.BFSTrace=function(s,t){
    const trace = _BFSTraceWawe(s,t,false);
    if(!trace)
        return false;
    return _BFSTraceReverse(s,t,trace);
};

const _BFSTraceWawe = function(s,t,searchCycle){
    searchCycle=searchCycle||false;
    const queue=[];
    const trace={};
    let found=false;
    queue.push(s);
    trace[s]=0;
    while(queue.length) {
        const node = queue.shift();
        if (node === t && Object.keys(trace).length > 1) {
            found = true;
        }
        else {
            for (let i = 0; i < GAlg.g.nodeNeighbourNodes[node].length; i++) {
                const id_ = GAlg.g.nodeNeighbourNodes[node][i];
                if (trace[id_] === null || trace[id_] === undefined) {
                    trace[id_] = trace[node] + 1;
                    queue.push(id_);
                }
                else if(searchCycle && trace[id_]>=trace[node]){
                    trace.__CYCLE_NODE=id_;
                    found=true;
                    break;
                }
            }
        }
        if (found)
            break;
    }
    if(!found)
        return false;
    else
        return trace;
};

const _BFSTraceReverse=function(s,t,trace){
    let c_node=t;
    const s_trace=[];
    s_trace.push(t);
    while(1){
        if(c_node===s)
            break;
        for(let i=0;i<GAlg.g.nodeNeighbourNodes[c_node].length;i++){
            const id = GAlg.g.nodeNeighbourNodes[c_node][i];
            if(trace[id]===trace[c_node]-1){
                s_trace.push(id);
                c_node=id;
                break;
            }
        }
    }
    return s_trace.reverse();
};

const _BFSCycleTraceReverse=function(trace){
    const max = trace[trace.__CYCLE_NODE];
    const s_trace=[];
    Object.keys(trace).map((node)=>{
        if(trace[node]<=max)
            s_trace.push(node);
    });
    return s_trace;
};

GAlg.Cycle = function(){
    const traces=[];
    for(let i=0;i<GAlg.g.nodesArray.length;i++){
        const nodeId = GAlg.g.nodesArray[i].id;
        let trace=_BFSTraceWawe(nodeId,nodeId,true);
        if(trace){
            traces.push(_BFSCycleTraceReverse(trace));
        }
    }
    if(traces.length===0)
        return false;
    let min=[0xffffffff,null];
    for(let i=0;i<traces.length;i++){
        if(traces[i].length>2 && traces[i].length<min[0]){
            min[0]=traces[i].length;
            min[1]=i;
        }
    }
    if(min[1]!==null)
        return traces[min[1]];
    else
        return false;
};

GAlg.CycleUI = function(){
    const trace=GAlg.Cycle();
    if(trace!==false)
        for(let i=0;i<trace.length;i++){
            g.setNodeProp(trace[i],"cycle");
        }
};
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
        "highlight":"#768DCC",
        "trace":"#CE44F4",
        "trace_s":"#5021CC",
        "trace_t":"#CC1205",
        "cycle":"#A1F69B"
    },
    bgColor:"#F2F5FC",
    edgeColor:{
        "":"#E87C7C",
        "highlight":"#94A4CC",
        "trace":"#CE44F4",
        "cycle":"#A1F69B"
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
        setTimeout(redraw,50);
        //requestAnimationFrame(redraw);
    };
    //requestAnimationFrame(redraw);
    setTimeout(redraw,50);

    const startRender = ()=>{
        canvasManager.clear(cfg.bgColor);
        ctx.save();
        ctx.translate(-viewport().x,-viewport().y);
    };

    const endRender = ()=>{
        ctx.restore();
    };

    const nodeRender = ()=>{
        ctx.font="20px Arial";
        g.nodesArray.map((node)=>{
            ctx.fillStyle=cfg.nodeColor.hasOwnProperty(node.prop)?cfg.nodeColor[node.prop]:cfg.nodeColor[""];
            ctx.beginPath();
            ctx.arc(node.x,node.y,node.size,0,2*Math.PI,false);
            ctx.fill();
            ctx.closePath();
            ctx.fillStyle="black";
            ctx.fillText(node.id,node.x,node.y);
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
    GAlg.g = g;
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
    let nodeBFSTrace=[];

    const specialMarked={};
    specialMarked.nodes={};
    specialMarked.edges={};
    specialMarked.nodes.BFSTraceNodeId=[];
    specialMarked.edges.BFSTraceEdgeId=[];

    this.layout=(layout,data)=>{
        g.nodesArray.map((node,i)=>{
            const c = layout(i,g.nodesArray.length,data);
            node.x=c.x;
            node.y=c.y;
        });
    };

    const addToBFSTrace = (id)=>{
        if(id===null)return;
        nodeBFSTrace.push(id);
        if(nodeBFSTrace.length===2){
            if(nodeBFSTrace[0]!==nodeBFSTrace[1]) {
                const trace = GAlg.BFSTrace(nodeBFSTrace[0], nodeBFSTrace[1]);
                for (let i = 0; i < trace.length; i++) {
                    const node = trace[i];
                    setNodeProp(node, "trace");
                    if (i < trace.length - 1) {
                        const edge = getEdgeIdByST(node, trace[i + 1]);
                        setEdgeProp(edge, "trace");
                        specialMarked.edges.BFSTraceEdgeId.push(edge);
                    }
                }
                setNodeProp(trace[0], "trace_s");
                setNodeProp(trace[trace.length - 1], "trace_t");
                specialMarked.nodes.BFSTraceNodeId = trace;
            }
            nodeBFSTrace=[];
        }
        else if(nodeBFSTrace.length>2){
            nodeBFSTrace=[];
        }
    };

    const getEdgeIdByST = (s,t)=>{
        for(let i=0;i<g.edgesArray.length;i++){
            const edge=g.edgesArray[i];
            if((edge.s===s && edge.t===t) || (edge.s===t && edge.t===s))
                return edge.id;
        }
    };
    this.getEdgeIdByST=getEdgeIdByST;

    const setNodeProp = (id,prop)=>{
        if(id===null)return;
        let specMarked=false;
        Object.keys(specialMarked.nodes).map((key)=>{
            if(specialMarked.nodes[key].includes(id))
                specMarked=true;
        });
        if(specMarked)return;
        g.nodesIndex[id].prop=prop;
    };
    this.setNodeProp=setNodeProp;
    const setEdgeProp = (id,prop)=>{
        if(id===null || id===undefined)return;
        let specMarked=false;
        Object.keys(specialMarked.edges).map((key)=>{
            if(specialMarked.edges[key].includes(id))
                specMarked=true;
        });
        if(specMarked)return;
        g.edgesIndex[id].prop=prop;
    };
    this.setEdgeProp=setEdgeProp;

    const cleanAllProps = ()=>{
        Object.keys(specialMarked.nodes).map((key)=>{
            specialMarked.nodes[key]=[];
        });
        Object.keys(specialMarked.edges).map((key)=>{
            specialMarked.edges[key]=[];
        });
        g.edgesArray.map((edge)=>edge.prop="");
        g.nodesArray.map((node)=>node.prop="");
    };
    this.cleanAllProps=cleanAllProps;

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

    canvasManager.onclick=(e)=>{
        cleanAllProps();
        addToBFSTrace(getNodeIdByCoords(e.x,e.y));
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
