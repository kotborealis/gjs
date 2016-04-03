'use strict';
const GAlg={};
GAlg.g={};

/**
 * Main functions
 */
GAlg.BFSTravel = function(root, cb1, cb2){
    cb1=cb1||function(){};
    cb2=cb2||function(){};
    const queue=[];
    const trace={};

    queue.push(root);
    trace[root]=0;

    while(queue.length){
        const node = queue.shift();
        if(cb1({trace,node})===true){
            return trace;
        }
        for(let i=0; i<GAlg.g.nodeNeighbourNodes[node].length; i++){
            const child_node = GAlg.g.nodeNeighbourNodes[node][i];
            if(trace[child_node]===null || trace[child_node]===undefined){
                trace[child_node]=trace[node]+1;
                queue.push(child_node);
            }
            if(cb2({trace,node,child_node})===true){
                return trace;
            }
        }
    }
    return trace;
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
GAlg.BFSRawCycleTraceReverse = function(CycleNode, trace){
    const s_trace=[];
    const n_trace=[];
    for(let i=0;i<Object.keys(trace).length;i++){
        const id = Object.keys(trace)[i];
        let c = 0;
        for(let j=0;j<Object.keys(trace).length;j++){
            if(i===j)continue;
            const id2=Object.keys(trace)[j];
            if(GAlg.g.nodeNeighbourNodes[id].includes(id2))
                c++;
            if(c>=2)break;
        }
        if(c<2)trace[id]=-1;
    }
    console.log(trace);
    Object.keys(trace).map((id)=>{
        if(trace[id]>-1)n_trace.push(id);
    });
    return n_trace;
};

/**
 * Wrappers
 */
GAlg.BFSTrace = function(source,target){
    let found = false;
    const raw_trace = GAlg.BFSTravel(source,
        (e)=>{
            if(e.node===target){
                found = true;
                return true;
            }
    });
    if(!found)
        return false;
    return GAlg.BFSRawTraceReverse(source, target, raw_trace);
};

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
        if(CycledNode!==null && Object.keys(trace).length>3){
            const _ = GAlg.BFSRawCycleTraceReverse(CycledNode,trace);
            console.log(_);
            if(_!==null && _.length>=3)
                traces.push(_);
        }
    });
    return traces;
};

GAlg.BFSBipartite = function(){
    const trace={};
    trace[GAlg.g.nodesArray[0].id]=true;
    let bipartite=true;
    GAlg.BFSTravel(GAlg.g.nodesArray[0].id,()=>{return false;},(e)=>{
        if(trace[e.child_node]===undefined) {
            trace[e.child_node] = !trace[e.node];
            return false;
        }
        else if(trace[e.node]===trace[e.child_node]){
            bipartite=false;
            return true;
        }
        else
            return false;
    });
    return {bipartite,trace};
};