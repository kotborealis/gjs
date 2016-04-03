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