'use strict';
const GAlg={};
GAlg.g={};

/**
 * BFS Trace
 */
GAlg.BFSTraceTravel = function(root, target){
    const queue=[];
    const trace={};

    queue.push(root);
    trace[root]=0;

    while(queue.length){
        const node = queue.shift();
        if(node===target){
            return trace;
        }
        for(let i=0; i<GAlg.g.nodeNeighbourNodes[node].length; i++){
            const child_node = GAlg.g.nodeNeighbourNodes[node][i];
            if(trace[child_node]===undefined){
                trace[child_node]=trace[node]+1;
                queue.push(child_node);
            }
        }
    }
    return false;
};
GAlg.BFSRawTraceReverse = function (s, t, trace) {
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
GAlg.BFSTrace = function(source,target){
    const raw_trace = GAlg.BFSTraceTravel(source,target);
    if(!raw_trace)
        return [];
    return GAlg.BFSRawTraceReverse(source, target, raw_trace);
};


/**
 * BFS Cycle
 */
GAlg.BFSCycle = function(){
    let traces=[];
    GAlg.g.nodesArray.map((node_)=>{
        let CycledNode = null;
        const node = node_.id;
        const trace = GAlg.BFSTravel(node,()=>{},(e)=>{
            if(e.trace[e.child_node]>=e.trace[e.node]){
                CycledNode=e.child_node;
                return true;
            }
        });
        console.log(CycledNode,trace);
        if(CycledNode!==null && Object.keys(trace).length>3){
            alert("Yep!");
            return;
            const _ = null;//GAlg.BFSRawCycleTraceReverse(CycledNode,trace);
            console.log(_);
            if(_!==null && _.length>=3)
                traces.push(_);
        }
    });
    return traces;
};

/**
 * BFS Bipartite
 */
GAlg.BFSBipartiteTravel = function(root){
    const queue=[];
    const trace={};
    const b_trace={};

    b_trace[root]=true;

    queue.push(root);
    trace[root]=0;

    while(queue.length){
        const node = queue.shift();
        for(let i=0; i<GAlg.g.nodeNeighbourNodes[node].length; i++){
            const child_node = GAlg.g.nodeNeighbourNodes[node][i];
            if(trace[child_node]===undefined){
                trace[child_node]=trace[node]+1;
                queue.push(child_node);
            }
            if(b_trace[child_node]===undefined)
                b_trace[child_node] = !b_trace[node];
            else if(b_trace[node]===b_trace[child_node])
                return {bipartite:false,trace:b_trace};
        }
    }
    return {bipartite:true,trace:b_trace};
};
GAlg.BFSBipartite = function(){
    return GAlg.BFSBipartiteTravel(GAlg.g.nodesArray[0].id);
};