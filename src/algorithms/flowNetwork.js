export const FordFulkerson = function (graph, source, target){

    const flow = new Map();
    graph.edges.forEach(edge => {
        flow.set(edge, 0);
    });

    let path = findFlowEdgePath(graph, flow, source, target);
    while(path){
        const path_w = path.reduce((min_w, edge) => {
            return Math.min(min_w, edge.weight - flow.get(edge));
        }, Number.POSITIVE_INFINITY);

        path.forEach(edge => {
            flow.set(edge, flow.get(edge) + path_w);
            flow.set(edge.meta.reverseEdge, flow.get(edge.meta.reverseEdge) - path_w);
        });

        path = findFlowEdgePath(graph, flow, source, target);
    }

    const capacity = Math.min(
        [...source.meta.sourceOf].reduce((sum, edge) => sum + flow.get(edge), 0),
        [...target.meta.targetOf].reduce((sum, edge) => sum + flow.get(edge), 0)
    );

    return {flow, capacity};
};

const findFlowEdgePath = function (graph, flow, source, target){
    const queue = [];
    const trace = new Map();
    const visited = new Set();

    queue.push(source);
    trace.set(source, null);

    while(queue.length){
        const node = queue.shift();
        visited.add(node);
        for (let childEdge of node.meta.sourceOf) {
            if (childEdge.weight - flow.get(childEdge) > 0 && !trace.has(childEdge) && !visited.has(childEdge.t)) {
                trace.set(childEdge.t, childEdge);
                queue.push(childEdge.t);
                if(childEdge.t === target){
                    return traceFlowEdgePath(source, target, trace);
                }
            }
        }
    }

    return null;
};

const traceFlowEdgePath = function(source, target, trace){
    const path = [trace.get(target)];
    let node = trace.get(target).s;
    while(trace.get(node)){
        path.push(trace.get(node));
        node = trace.get(node).s;
    }
    return path.reverse();
};
