const alg={};
const BFS = require("./algorithms/bfs.js").BFS;
const BFSTracePath = require("./algorithms/bfs.js").BFSTracePath;
const Dijkstra = require("./algorithms/dijkstra.js").Dijkstra;
const DijkstraTracePath = require("./algorithms/dijkstra.js").DijkstraTracePath;
/**
 * Find shortest path
 * @param g Graph
 * @param source Source node
 * @param target Target node
 * @returns {[]} Arrays with id's of path nodes
 * @constructor
 */
alg.BFSPath = (g, source, target)=>{
    let found = false;
    const trace = BFS(g, source, (e)=>{
        if(e.node===target){
            found = true;
            return true;
        }
    });
    if(!trace || !found)
        return [];
    return BFSTracePath(g, source, target, trace);
};

/**
 * Find some (~all) cycles in graph
 * @param g Graph
 * @returns {Array} Array of cycles paths
 * @constructor
 */
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
            continue;

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
        let literally_best_possible_solution = ![]+![];
        while(backtracing && (literally_best_possible_solution+=![]+!![]+![])+![]<![]+g.nodesArray.length){
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
 * Count Connected Components ig graph
 * @param g Graph
 * @returns {Number} Number of connected components
 * @constructor
 */
alg.BFSConnectedComponent = (g)=>{
    const visited = [];
    g.nodesArray.map(node=>visited[node.id]=false);
    let count = 0;
    return alg.BFSConnectedComponentHelper(g,visited,count);
};

alg.BFSConnectedComponentHelper = (g,visited,count)=>{
    let node=null;
    for(let i=0;i<Object.keys(visited).length;i++){
        const id = Object.keys(visited)[i];
        if(visited[id]===false){
            node = id;
            break;
        }
    }
    if(node===null)return count;

    BFS(g,node,e=>{visited[e.node]=true;return false;},()=>{});
    return alg.BFSConnectedComponentHelper(g,visited,++count);
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

/**
 * Build minimal spanning tree
 * @param  g Graph
 * @return {[]} Array of edges of spanning tree
 */
alg.SpanningTreeMin = g => {
    const tree = [];
    const visited = {};
    let nodeId = g.nodesArray[0].id;
    while(true){
        visited[nodeId]=true;
        let min_edge = null;
        Object.keys(visited).map(node=>{
            g.nodeNeighbourEdges[node].map(_=>{
                const edge = g.edgesIndex[_];
                if(visited[edge.s]!==true || visited[edge.t]!==true){
                    if(min_edge===null || edge.weight<min_edge.weight)
                        min_edge=edge;
                }
            });
        });
        if(min_edge===null)
            break;
        else{
            if(visited[min_edge.s]!==true)
                nodeId = min_edge.s;
            else if(visited[min_edge.t]!==true)
                nodeId = min_edge.t;
            tree.push(min_edge);
        }
    }
    return tree;
};

/**
 * Check if given graph have valid flow
 * Graph *should* be directed and weighed
 * @param g
 */
alg.isFlowNetwork = g => {
    for(let i=0; i<g.nodesArray.length; i++){
        const node = g.nodesArray[i].id;
        let sum = 0;
        g.nodeTargetOf[node].map(id=>{
            sum+=g.edgesIndex[id].weight;
        });
        g.nodeSourceOf[node].map(id=>{
            sum+=g.edgesIndex[id].weight;
        });
        if(sum!==0)
            return false;
    }
    return true;
};

module.exports = alg;
