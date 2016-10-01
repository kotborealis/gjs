import * as BFS from './bfs';

export const maxFlowFordFulkerson = function (graph, source, target){
    const constrains = graph.clone();
    const flow = graph.clone();

    const constrains_source = constrains.nodesIndex.get(source.id);
    const constrains_target = constrains.nodesIndex.get(target.id);

    const flow_source = flow.nodesIndex.get(source.id);
    const flow_target = flow.nodesIndex.get(target.id);

    flow.edges.forEach(edge => {edge.weight = 0;});

    let path = findFlowEdgePath(graph, constrains_source, constrains_target);
    while(path){
        console.log("Found path");
        console.log(path.map(e => e.s.id + ' ' + e.t.id).join(' -> '));

        const path_w = path.reduce((min_w, edge) => {
            return Math.min(min_w, edge.weight);
        }, Number.POSITIVE_INFINITY);

        console.log("Path w",path_w);

        path.forEach(edge => {
            const constrains_edge = constrains.edgesIndex.get(edge.id);
            const flow_edge = flow.edgesIndex.get(edge.id);

            constrains_edge.weight -= path_w;
            constrains_edge.meta.reverseEdge.weight += path_w;

            flow_edge.weight += path_w;
            flow_edge.meta.reverseEdge.weight -= path_w;
        });

        console.log("constrains");
        constrains.edges.forEach(e => {
            console.log(`Edge ${e.s.id} -> ${e.t.id}: ${e.weight}`);
        });

        console.log("flow");
        flow.edges.forEach(e => {
            console.log(`Edge ${e.s.id} -> ${e.t.id}: ${e.weight}`);
        });

        path = findFlowEdgePath(graph, constrains_source, constrains_target);
    }
    console.log("MAX FLOW");
    flow.edges.forEach(e => {
        console.log(`Edge ${e.s.id} -> ${e.t.id}: ${e.weight}`);
    });
};

const findFlowEdgePath = function (graph, source, target){
    const queue = [];
    const trace = new Map();
    const visited = new Set();

    queue.push(source);
    trace.set(source, null);

    while(queue.length){
        const node = queue.shift();
        visited.add(node);
        if(node === target){
            return traceFlowEdgePath(graph, source, target, trace);
        }
        else {
            for (let outEdge of node.meta.sourceOf) {
                if (outEdge.weight !== 0 && !trace.has(outEdge) && !visited.has(outEdge.t)) {
                    trace.set(outEdge.t, outEdge);
                    queue.push(outEdge.t);
                }
            }
        }
    }

    return null;
};

const traceFlowEdgePath = function(graph, source, target, trace){
    const path = [trace.get(target)];
    let node = trace.get(target).s;
    while(trace.get(node)){
        path.push(trace.get(node));
        node = trace.get(node).s;
    }
    return path.reverse();
};
