export const generator = function* (graph, root) {
    const queue = [];
    const trace = new Map();

    queue.push(root);
    trace.set(root, 0);

    while(queue.length){
        const node = queue.shift();
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

export const tracePath = (graph, source, target, trace) => {
    let node = target;
    const path = [];
    path.push(target);

    for(;;){
        if(node === source)
            break;
        for(let child of node.meta.reverseNeighbourNodes){
            if(trace.get(child) === trace.get(node) - 1){
                path.push(child);
                node = child;
                break;
            }
        }
    }

    return path.reverse();
};
