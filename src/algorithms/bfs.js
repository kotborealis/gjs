export const generator = function* (graph, root) {
    const queue = [];
    const trace = new Map();

    queue.push(root);
    trace.set(root, 0);

    while(queue.length){
        const node = queue.shift();
        console.log("got to node",node.id);
        yield {type: "node", trace, node};
        for(let child of node.meta.neighbourNodes){
            yield {type: "child", trace, child};
            if(!trace.has(child)){
                trace.set(child, trace.get(node) + 1);
                queue.push(child);
            }
        }
    }
    yield {type: "end", trace};
};

module.exports.BFSTracePath = (g, source, target, trace)=>{
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
