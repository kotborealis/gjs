console.time("Run");

const lines = require('fs').readFileSync(process.argv[2]).toString().split('\n');

const nodes_count = Number.parseInt(lines[0]);
const graph_matrix = [];
const flow_matrix = [];

for(let i = 0; i < nodes_count; ++i){
    graph_matrix.push(new Int16Array(lines[i + 1].split(' ').map(i => Number.parseInt(i))));
    flow_matrix.push(new Int16Array(nodes_count));
}

const traceFlowEdgePath = (trace) => {
    const path = [1];
    let node = trace.get(1);
    while(node !== null){
        path.push(node);
        node = trace.get(node);
    }
    return path.reverse();
};

const findFlowEdgePath = () => {
    const queue = [0];
    const trace = new Map();
    trace.set(0, null);
    while(queue.length){
        const node = queue.shift();
        for (let child = 0; child < nodes_count; ++child) {
            if (graph_matrix[node][child] - flow_matrix[node][child] > 0 && !trace.has(child)) {
                trace.set(child, node);
                if (child == 1)
                    return traceFlowEdgePath(trace);
                queue.push(child);
            }
        }
    }
    return null;
};

let path = findFlowEdgePath();
while(path){
    let path_w = Number.POSITIVE_INFINITY;
    for(let i = 0; i < path.length - 1; ++i){
        path_w = Math.min(path_w, graph_matrix[path[i]][path[i + 1]] - flow_matrix[path[i]][path[i + 1]]);
    }

    for(let i = 0; i < path.length - 1; ++i){
        flow_matrix[path[i]][path[i + 1]] = flow_matrix[path[i]][path[i + 1]] + path_w;
        flow_matrix[path[i + 1]][path[i]] = flow_matrix[path[i + 1]][path[i]] - path_w;
    }

    path = findFlowEdgePath();
}

let capacity = 0;
for(let i = 1; i < nodes_count; i++){
    capacity += flow_matrix[0][i];
}

console.timeEnd("Run");
process.stdout.write(capacity.toString());
