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
            else if(cb2({trace,node,child_node})===true){
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
    let c_node=CycleNode;
    const s_trace=[];
    s_trace.push(CycleNode);
    while(1){
        //console.log("FIRST WHILE",c_node,s_trace);
        if(trace[c_node]===0)
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
    while(1){
        let stop=true;
        //console.log("SECOND WHILE",c_node,s_trace);
        if(c_node===CycleNode)
            break;
        for(let i=0;i<GAlg.g.nodeNeighbourNodes[c_node].length;i++){
            const id = GAlg.g.nodeNeighbourNodes[c_node][i];
            //console.log(id);
            if(trace[id]===trace[c_node]+1 && (!s_trace.includes(id) || id===CycleNode)){
                s_trace.push(id);
                c_node=id;
                stop=false;
                break;
            }
        }
        if(stop)break;
    }
    if(s_trace[0]!==s_trace[s_trace.length-1]){
        s_trace.pop();
        if(GAlg.g.nodeNeighbourNodes[s_trace[s_trace.length-1]].includes(s_trace[0]))
            s_trace.push(s_trace[0]);
        else
            return null;
    }
    return s_trace;
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
    for(let i=0;i<GAlg.g.nodesArray.length;i++){
        let CycledNode = null;
        let PrevNode = null;
        const node = GAlg.g.nodesArray[i].id;
        const trace = GAlg.BFSTravel(node,()=>{},(e)=>{
            if(e.trace[e.child_node]>=e.trace[e.node]){
                CycledNode=e.child_node;
                return true;
            }
        });
        if(CycledNode!==null && Object.keys(trace).length>3){
            const _ = GAlg.BFSRawCycleTraceReverse(CycledNode,trace);
            if(_!==null && _.length>3)
                traces.push(_);
        }
    }
    return traces;
};
