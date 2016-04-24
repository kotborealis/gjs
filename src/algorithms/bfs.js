'use strict';
const BFS = (g, root, onNode, onChild)=>{
    onNode=onNode||function(){};
    onChild=onChild||function(){};
    const queue=[];
    const trace={};

    queue.push(root);
    trace[root]=0;

    while(queue.length){
        const node = queue.shift();
        if(onNode({trace,node})===true)
            return trace;
        for(let i=0; i<g.nodeNeighbourNodes[node].length; i++){
            const child = g.nodeNeighbourNodes[node][i];
            if(onChild({trace,node,child})===true)
                return trace;
            if(trace[child]===undefined){
                trace[child]=trace[node]+1;
                queue.push(child);
            }
        }
    }
    return trace;
};

const BFSTracePath = (g, source, target, trace)=>{
    let c_node=target;
    const s_trace=[];
    s_trace.push(target);
    while(1){
        if(c_node===source)
            break;
        for(let i=0;i<g.nodeNeighbourNodes[c_node].length;i++){
            const id = g.nodeNeighbourNodes[c_node][i];
            if(trace[id]===trace[c_node]-1){
                s_trace.push(id);
                c_node=id;
                break;
            }
        }
    }
    return s_trace.reverse();
};