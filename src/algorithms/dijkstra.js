const generator = function* (graph, root) {
    const visited = new Set();
    const trace = new Map();
    const queue = [];

    graph.nodes.forEach(node => {
        queue.push(node);
        trace.set(node, {
            dist: Number.POSITIVE_INFINITY,
            previous_node: null
        });
    });

    trace.get(root).dist = 0;

    while(queue.length){
        let min_dist = Number.POSITIVE_INFINITY;
        let node = null;

        trace.forEach((value, trace_node) => {
            if(value.dist < min_dist && !visited.has(trace_node)){
                min_dist = value.dist;
                node = trace_node;
            }
        });

        if(!node){
            break;
        }

        visited.add(node);

        yield {type: "node", trace, node};

        for(let child of node.meta.neighbourNodes){
            yield {type: "child", trace, child};

            const alt = trace.get(node).dist + graph.getEdgeBySourceTarget(node, child).weight;

            if(alt < trace.get(child).dist){
                trace.get(child).dist = alt;
                trace.get(child).previous_node = node;
            }
        }
    }
    yield {type: "end", trace};
};

const tracePath = (graph, source, target, trace) => {
    let node = target;
    const path = [];
    path.push(target);

    while(trace.get(node).previous_node !== null){
        path.push(trace.get(node).previous_node);
        node = trace.get(node).previous_node;
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
