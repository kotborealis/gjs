'use strict';

function Gjs(canvas){
    const g = new Graph();
    const canvasManager = new CanvasManager(canvas);
    const camera = new Camera(canvasManager,g);
this.g=g;
    let hoverNodeId=null;
    let highlightNodeId=[];
    let highlightEdgeId=[];
    let dragNodeId=null;
    let edgeSourceNodeId=null;
    let pathFindingNodes=[];

    const specialMarked={};
    specialMarked.nodes=[];
    specialMarked.edges=[];

    //Graph Functions
    this.loadFromFile = (file)=>{
        loadJsonFromFile(file,(json)=>{
            cleanAllProps();
            pathFindingNodes=[];
            dragNodeId=null;
            edgeSourceNodeId=null;
            hoverNodeId=null;
            highlightEdgeId=[];
            highlightNodeId=[];
            specialMarked.nodes=[];
            specialMarked.edges=[];
            g.clear();
            if(json.hasOwnProperty("nodes") && json.hasOwnProperty("edges")){
                g.addNode(json.nodes);
                g.addEdge(json.edges);
            }
        });
    };

    const addToPathFinding = (id)=>{
        if(id===null)return;
        pathFindingNodes.push(id);
        if(pathFindingNodes.length===2){
            if(pathFindingNodes[0]!==pathFindingNodes[1]) {
                cleanAllProps();
                console.log(this.pathFinderFunction);
                const trace = alg[this.pathFinderFunction](g,pathFindingNodes[0], pathFindingNodes[1]);
                for (let i = 0; i < trace.length; i++) {
                    const node = trace[i];
                    setNodeProp(node, "trace", true);
                    if (i < trace.length - 1) {
                        const edge = g.getEdgeIdByST(node, trace[i + 1]);
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
        const traces=alg.BFSCycle(g);
        let min_length=Number.POSITIVE_INFINITY;
        let min_i=-1;
        for(let i=0;i<traces.length;i++){
            if(traces[i].length<min_length){
                min_length=traces[i].length;
                min_i=i;
            }
        }
        if(min_i===-1)return;

        for(let i=0;i<traces[min_i].length;i++){
            const node = traces[min_i][i];
            setNodeProp(node,"cycle", true);
            if (i < traces[min_i].length - 1) {
                const edge = g.getEdgeIdByST(node, traces[min_i][i + 1]);
                setEdgeProp(edge, "cycle", true);
            }
        }
    };

    const isBipartite = function(){
        const bipartite=alg.BFSBipartite(g);
        const trace = bipartite.trace;
        Object.keys(trace).map((id)=>{
            setNodeProp(id,trace[id]?"bipartite1":"bipartite2",true);
        });
        return bipartite;
    };

    const spanningTreeMin = function(){
        console.log(alg.SpanningTreeMin(g));
        alg.SpanningTreeMin(g).map(edge=>setEdgeProp(edge.id,"spanning_tree",true));

    };

    //util functions
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


    //events
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

    //Pathfinder
    this.pathFinderFunction = "BFSPath";

    //GUI
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
    this.spanningTreeMin = spanningTreeMin;
    this.camera = camera;
    this.saveFile = ()=>{
        const data=JSON.stringify({nodes:g.nodesArray,edges:g.edgesArray});
        saveAs(new Blob([data], {type: "application/json;charset=utf-8"}),randomString(10)+".json");
    }
}

//layout functions
const circleLayout = function(e){
    const x=(e.data.radius*Math.cos(e.nodeIndex*2*Math.PI/e.nodesLength))>>0;
    const y=(e.data.radius*Math.sin(e.nodeIndex*2*Math.PI/e.nodesLength))>>0;
    return {x,y};
};
const gridLayout = function(e){
    const x=e.data.offset*(e.nodeIndex%e.data.row);
    const y=e.data.offset*((e.nodeIndex/e.data.row)<<0);
    return {x,y};
};
const bipartiteLayout = function(e) {
    let x=e.data.trace[e.nodeId]?0:e.data.partOffset;
    let y=e.data.trace[e.nodeId]?((e.data.leftIndex++)*e.data.elementOffset):((e.data.rightIndex++)*e.data.elementOffset)
    if(e.data.direction==='vertical'){
        const _=x;
        x=y;
        y=_;
    }
    return {x,y};
};
