'use strict';
const Dijkstra = (g, source)=>{
    const trace={};
    const node_set=[];
    const visited={};

    g.nodesArray.map((node)=>{
        node_set.push(node.id);
        trace[node.id]={};
        trace[node.id].dist=Number.POSITIVE_INFINITY;
    });

    trace[source].dist=0;
    while(node_set.length>0){
        let min_dist=Number.POSITIVE_INFINITY;
        let min_node_i=0;
        let node=null;
        for(let i=0;i<Object.keys(trace).length;i++){
            const id = Object.keys(trace)[i];
            if(trace[id].dist<min_dist && visited[id]!==true){
                min_dist=trace[id].dist;
                node=id;
                min_node_i=i;
            }
        }
        if(node===null)
            break;
        visited[node]=true;

        for(let i=0;i<g.nodeNeighbourNodes[node].length;i++){
            const child = g.nodeNeighbourNodes[node][i];
            const alt = trace[node].dist + g.edgesIndex[g.getEdgeIdByST(node,child)].weight;
            if(alt<trace[child].dist){
                trace[child].dist=alt;
                trace[child].prev=node;
            }
        }
    }
    return trace;
};

const DijkstraTracePath = (g, source, target, trace)=>{
    const s_trace = [];
    let node = target;
    s_trace.unshift(target);
    while(trace[node].prev!==undefined){
        s_trace.unshift(trace[node].prev);
        node=trace[node].prev;
    }
    return s_trace;
};