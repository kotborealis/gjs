const generator = function* (graph, root) {
    const queue = [];
    const trace = new Map();

    queue.push(root);
    trace.set(root, null);

    while(queue.length){
        const node = queue.shift();
        yield {type: "node", trace, node};
        for(let child of node.meta.neighbourNodes){
            yield {type: "child", trace, child};
            if(!trace.has(child)){
                trace.set(child, node);
                queue.push(child);
            }
        }
    }
    yield {type: "end", trace};
};

const tracePath = (graph, source, target, trace) => {
    const path = [target];
    let node = trace.get(target);
    while(node){
        path.push(node);
        node = trace.get(node);
    }
    return path.reverse();
};

const shortestPath = (graph, source, target) => {
    const gen = generator(graph, source, target);
    for(;;){
        const value = gen.next().value;
        if(value.node === target){
            return tracePath(graph, source, target, value.trace);
        }
        else if(value.type === "end"){
            return null;
        }
    }
};

module.exports = {generator, shortestPath, tracePath};

