'use strict';

function Gjs(canvas,nodes,edges){
    var g = new Graph();
    GAlg.g = g;
    g.addNode(nodes);
    g.addEdge(edges);
    var canvasManager = new CanvasManager(canvas);
    var camera = new Camera(canvasManager,g);
    this.camera = camera;

    let hoverNodeId=null;
    let highlightNodeId=[];
    let highlightEdgeId=[];
    let dragNodeId=null;
    let edgeSourceNodeId=null;
    let pathFindingNodes=[];

    const specialMarked={};
    specialMarked.nodes=[];
    specialMarked.edges=[];

    const addToPathFinding = (id)=>{
        if(id===null)return;
        pathFindingNodes.push(id);
        if(pathFindingNodes.length===2){
            if(pathFindingNodes[0]!==pathFindingNodes[1]) {
                cleanAllProps();
                const trace = GAlg[this.pathFinderFunction](pathFindingNodes[0], pathFindingNodes[1]);
                for (let i = 0; i < trace.length; i++) {
                    const node = trace[i];
                    setNodeProp(node, "trace", true);
                    if (i < trace.length - 1) {
                        const edge = getEdgeIdByST(node, trace[i + 1]);
                        setEdgeProp(edge, "trace", true);
                    }
                }
                setNodeProp(trace[0], "trace_s", true);
                setNodeProp(trace[trace.length - 1], "trace_t", true);
            }
            pathFindingNodes=[];
        }
        else if(pathFindingNodes.length>2){
            pathFindingNodes=[];
        }
    };

    const searchMinCycle = function(){
        cleanAllProps();
        const traces = GAlg.BFSCycle();
        if(!traces.length)return;
        let min = traces[0].length;
        let minI = 0;
        for(let i=1;i<traces.length;i++){
            if(traces[i].length<min)
                minI=i;
        }
        for(let i=0;i<traces[minI].length;i++){
            setNodeProp(traces[minI][i],"cycle",true);
            //const edgeId=getEdgeIdByST(traces[minI][i],traces[minI][i+1]);
            //setEdgeProp(edgeId,"cycle");
        }
    };

    const isBipartite = function(){
        const bipartite=GAlg.BFSBipartite();
        const trace = bipartite.trace;
        Object.keys(trace).map((id)=>{
            setNodeProp(id,trace[id]?"bipartite1":"bipartite2");
        });
        return bipartite;
    };

    const getEdgeIdByST = (s,t)=>{
        for(let i=0;i<g.edgesArray.length;i++){
            const edge=g.edgesArray[i];
            if((edge.s===s && edge.t===t) || (edge.s===t && edge.t===s))
                return edge.id;
        }
    };

    const setNodeProp = (id,prop,special)=>{
        if(id===null || id===undefined)return;
        if(specialMarked.nodes.includes(id) && !special)return;
        g.nodesIndex[id].prop=prop;
        if(special===true)
            specialMarked.nodes.push(id);
    };

    const setEdgeProp = (id,prop,special)=>{
        if(id===null || id===undefined)return;
        if(specialMarked.edges.includes(id) && !special)return;
        g.edgesIndex[id].prop=prop;
        if(special===true)
            specialMarked.edges.push(id);
    };

    const cleanAllProps = ()=>{
        specialMarked.nodes=[];
        specialMarked.edges=[];
        g.edgesArray.map((edge)=>edge.prop="");
        g.nodesArray.map((node)=>node.prop="");
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
        camera.pointer=canvasManager.mouse;
        onNodeHover(getNodeIdByCoords(e.x,e.y));
    };

    canvasManager.ondrag=(e)=>{
        if(dragNodeId===null)
            onViewportDrag(e.dx,e.dy);
        else
            onNodeDrag(dragNodeId,e.dx/camera.zoom(),e.dy/camera.zoom());
    };

    canvasManager.onmousedown=(e)=>{
        dragNodeId=getNodeIdByCoords(e.x,e.y);
    };

    canvasManager.onmouseup=()=>{
        dragNodeId=null;
    };

    canvasManager.onclick=(e)=>{
        cleanAllProps();
        addToPathFinding(getNodeIdByCoords(e.x,e.y));
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

    canvasManager.onmousewheel=(e)=>{
        camera.zoom(e.deltaY);
    };

    //Layouts
    this.setLayout=(layout,data)=>{
        g.nodesArray.map((node,i)=>{
            const c = layout({
                nodeId:node.id,
                nodeIndex:i,
                nodesLength:g.nodesArray.length,
                data:data
            });
            node.x=c.x;
            node.y=c.y;
        });
    };

    this.layout={};
    this.layout.circle={};
    this.layout.circle.radius=150;
    this.layout.grid={};
    this.layout.grid.offset=70;
    this.layout.grid.row=3;
    this.layout.bipartite={};
    this.layout.bipartite.partOffset=200;
    this.layout.bipartite.elementOffset=70;
    this.layout.bipartite.direction='horizontal';

    this.pathFinderFunction = "BFSTrace";

    //GUI stuff
    this.layoutCircle = ()=>this.setLayout(circleLayout,this.layout.circle);
    this.layoutGrid = ()=>this.setLayout(gridLayout,this.layout.grid);
    this.layoutBipartite = ()=>{
        const bipartite = isBipartite();
        if(bipartite.bipartite){
            this.layout.bipartite.leftIndex=0;
            this.layout.bipartite.rightIndex=0;
            this.layout.bipartite.trace=bipartite.trace;
            this.setLayout(bipartiteLayout,this.layout.bipartite);
        }
    };
    this.searchMinCycle = searchMinCycle;
    this.isBipartite = isBipartite;
}

var circleLayout = function(e){
    var x=(e.data.radius*Math.cos(e.nodeIndex*2*Math.PI/e.nodesLength))>>0;
    var y=(e.data.radius*Math.sin(e.nodeIndex*2*Math.PI/e.nodesLength))>>0;
    return {x,y};
};
var gridLayout = function(e){
    var x=e.data.offset*(e.nodeIndex%e.data.row);
    var y=e.data.offset*((e.nodeIndex/e.data.row)<<0);
    return {x,y};
};
var bipartiteLayout = function(e) {
    var x=e.data.trace[e.nodeId]?0:e.data.partOffset;
    var y=e.data.trace[e.nodeId]?((e.data.leftIndex++)*e.data.elementOffset):((e.data.rightIndex++)*e.data.elementOffset)
    if(e.data.direction==='vertical'){
        var _=x;
        x=y;
        y=_;
    }
    return {x,y};
};
