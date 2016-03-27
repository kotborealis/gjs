'use strict';
const GAlg={};
GAlg.g={};

GAlg.BFS=function(s,t){
    const queue=[];
    const trace={};
    let found=false;
    Object.keys(GAlg.g.nodesIndex).map((id)=>trace[id]=null);

    queue.push(s);
    trace[s]=0;
    while(queue.length){
        const node = queue.shift();
        if(node===t) {
            found=true;
            break;
        }
        else{
            GAlg.g.nodeNeighbourNodes[node].map((id_)=>{
                if(trace[id_]===null){
                    trace[id_]=trace[node]+1;
                    queue.push(id_);
                }
            });
        }
    }
    if(!found)
        return false;
    else{
        let c_node=t;
        const s_trace=[];
        s_trace.push(t);
        while(1){
            if(c_node===s)
                break;
            for(let i=0;i<GAlg.g.nodeNeighbourNodes[c_node].length;i++){
                var id = GAlg.g.nodeNeighbourNodes[c_node][i];
                if(trace[id]===trace[c_node]-1){
                    s_trace.push(id);
                    c_node=id;
                    break;
                }
            }
        }
        return s_trace.reverse();
    }
};