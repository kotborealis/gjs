'use strict';
const GAlg={};
GAlg.g={};
GAlg.BFSTravel = function(root,cb1,cb2){
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
GAlg.BFSTrace = function(source,target){
    console.log(source,target);
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
    console.log("TRACE:",GAlg.BFSRawTraceReverse(source, target, raw_trace));
    return GAlg.BFSRawTraceReverse(source, target, raw_trace);
};
