export const maxFlowFordFulkerson = function (graph, source, target){
    const flow = graph.clone();

    flow.edges.forEach(edge => {edge.weight = 0;});

    let path = findFlowEdgePath(graph, flow, source, target);
    while(path){
        const path_w = path.reduce((min_w, edge) => {
            return Math.min(min_w, edge.weight - flow.edgesIndex.get(edge.id).weight);
        }, Number.POSITIVE_INFINITY);

        path.forEach(edge => {
            const flow_edge = flow.edgesIndex.get(edge.id);
            flow_edge.weight += path_w;
            flow_edge.meta.reverseEdge.weight -= path_w;
        });

        path = findFlowEdgePath(graph, flow, source, target);
    }

    return flow;
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
        if(node === target){
            return traceFlowEdgePath(source, target, trace);
        }
        else {
            for (let outEdge of node.meta.sourceOf) {
                if (outEdge.weight - flow.edgesIndex.get(outEdge.id).weight > 0 && !trace.has(outEdge) && !visited.has(outEdge.t)) {
                    trace.set(outEdge.t, outEdge);
                    queue.push(outEdge.t);
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
