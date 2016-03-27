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