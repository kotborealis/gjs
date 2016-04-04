'use strict';
const alg={};
/**
 * Find shortest path
 * @param g Graph
 * @param source Source node
 * @param target Target node
 * @returns {[]} Arrays with id's of path nodes
 * @constructor
 */
alg.BFSPath = (g, source, target)=>{
    const trace = BFS(g, source, (e)=>{
        if(e.node===target){
            return true;
    }
    });
    if(!trace)
        return [];
    return BFSTracePath(g, source, target, trace);
};

alg.BFSCycle = (g)=>{
    const traces=[];
    for(let i=0;i<g.nodesArray.length;i++){
        const id = g.nodesArray[i].id;
        let CycleNode=null;
        const trace=BFS(g,id,()=>{},(e)=>{
            if(e.trace[e.child]!==undefined && e.trace[e.child]>=e.trace[e.node]){
                CycleNode=e.child;
                return true;
            }
        });

        if(CycleNode===null)
            return [];

        let node = CycleNode;
        const s_trace=[];
        s_trace.push(node);
        let backtracing=true;
        while(backtracing){
            for(let i=0;i<Object.keys(trace).length;i++){
                const id = Object.keys(trace)[i];
                if((trace[id]===trace[node]-1 || trace[id]===trace[node])
                     && g.getEdgeIdByST(id,node)!==null){
                    if(trace[id]===0)
                        backtracing=false;
                    node = id;
                    s_trace.push(node);
                    break;
                }
            }
        }
        backtracing=true;
        let c=0;
        while(backtracing && c++<50){
            for(let i=0;i<Object.keys(trace).length;i++){
                const id = Object.keys(trace)[i];
                if( g.getEdgeIdByST(id,node)!==null
                    && (id===CycleNode||(trace[id]<=trace[CycleNode] && !s_trace.includes(id)))){
                    if(id===CycleNode)
                        backtracing=false;
                    node = id;
                    s_trace.push(node);
                    break;
                }
            }
        }
        if(s_trace[0]===s_trace[s_trace.length-1])
            traces.push(s_trace);
    }
    return traces;
};

/**
 * Determine if graph is bipartite
 * @param g Graph
 * @returns {{bipartite: boolean, trace: {}}}
 * @constructor
 */
alg.BFSBipartite = (g)=>{
    const root = g.nodesArray[0].id;
    const trace={};
    trace[root]=true;
    const result = {bipartite:true,trace};
    BFS(g, root, ()=>{},(e)=>{
        if(trace[e.child]===undefined)
            trace[e.child] = !trace[e.node];
        else if(trace[e.node]===trace[e.child]) {
            result.bipartite=false;
            return true;
        }
    });
    return result;
};

/**
 * Find shortest path in weighted graph
 * @param g Graph
 * @param source Source node
 * @param target Target node
 * @returns {[]} Array with id's of path nodes
 * @constructor
 */
alg.DijkstraPath = (g, source, target)=>{
    const trace = Dijkstra(g, source,target);
    if(!trace)
        return [];
    return DijkstraTracePath(g, source, target, trace);
};
