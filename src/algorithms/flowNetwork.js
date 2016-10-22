const FordFulkerson = function (graph, source, target){
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

    const capacity = [...source.meta.sourceOf].reduce((sum, edge) => sum + flow.get(edge), 0);

    return {flow, capacity};
};

const findFlowEdgePath = function (graph, flow, source, target){
    const queue = [];
    const trace = {};
    const visited = {};

    queue.push(source);

    while(queue.length){
        const node = queue.shift();
        visited[node.id] = true;
        for (let childEdge of node.meta.sourceOf) {
            if (visited[childEdge.t.id]!==true && childEdge.weight - flow.get(childEdge) > 0 && !trace[childEdge.id]) {
                trace[childEdge.t.id] = childEdge.id;
                if(childEdge.t === target){
                    return traceFlowEdgePath(graph, source, target, trace);
                }
                queue.push(childEdge.t);
            }
        }
    }

    return null;
};

const traceFlowEdgePath = function(graph, source, target, trace){
    const path = [graph.getEdge(trace[target.id])];
    let node = graph.getEdge(trace[target.id]).s;
    while(trace[node.id]){
        const _ = trace[node.id];
        path.push(graph.getEdge(_));
        node = graph.getEdge(_).s;
    }
    return path;
};

module.exports = {FordFulkerson, findFlowEdgePath, traceFlowEdgePath};
