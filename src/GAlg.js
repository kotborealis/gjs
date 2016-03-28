'use strict';
const GAlg={};
GAlg.g={};

GAlg.BFSTrace=function(s,t){
    const trace = _BFSTraceWawe(s,t,false);
    if(!trace)
        return false;
    return _BFSTraceReverse(s,t,trace);
};

const _BFSTraceWawe = function(s,t,searchCycle){
    searchCycle=searchCycle||false;
    const queue=[];
    const trace={};
    let found=false;
    queue.push(s);
    trace[s]=0;
    while(queue.length) {
        const node = queue.shift();
        if (node === t && Object.keys(trace).length > 1) {
            found = true;
        }
        else {
            for (let i = 0; i < GAlg.g.nodeNeighbourNodes[node].length; i++) {
                const id_ = GAlg.g.nodeNeighbourNodes[node][i];
                if (trace[id_] === null || trace[id_] === undefined) {
                    trace[id_] = trace[node] + 1;
                    queue.push(id_);
                }
                else if(searchCycle && trace[id_]>=trace[node]){
                    trace.__CYCLE_NODE=id_;
                    found=true;
                    break;
                }
            }
        }
        if (found)
            break;
    }
    if(!found)
        return false;
    else
        return trace;
};

const _BFSTraceReverse=function(s,t,trace){
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

const _BFSCycleTraceReverse=function(trace){
    const max = trace[trace.__CYCLE_NODE];
    const s_trace=[];
    Object.keys(trace).map((node)=>{
        if(trace[node]<=max)
            s_trace.push(node);
    });
    return s_trace;
};

GAlg.Cycle = function(){
    const traces=[];
    for(let i=0;i<GAlg.g.nodesArray.length;i++){
        const nodeId = GAlg.g.nodesArray[i].id;
        let trace=_BFSTraceWawe(nodeId,nodeId,true);
        if(trace){
            traces.push(_BFSCycleTraceReverse(trace));
        }
    }
    if(traces.length===0)
        return false;
    let min=[0xffffffff,null];
    for(let i=0;i<traces.length;i++){
        if(traces[i].length>2 && traces[i].length<min[0]){
            min[0]=traces[i].length;
            min[1]=i;
        }
    }
    if(min[1]!==null)
        return traces[min[1]];
    else
        return false;
};

GAlg.CycleUI = function(){
    const trace=GAlg.Cycle();
    if(trace!==false)
        for(let i=0;i<trace.length;i++){
            g.setNodeProp(trace[i],"cycle");
        }
};