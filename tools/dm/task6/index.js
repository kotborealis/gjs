console.time("Run");

const lines = require('fs').readFileSync(process.argv[2]).toString().split('\n');

const nodes_count = Number.parseInt(lines[0]);
const graph_matrix = [];

for(let i = 0; i < nodes_count; ++i){
    graph_matrix.push(new Int16Array(lines[i + 1].split(' ').map(i => Number.parseInt(i))));
}

let max_path_w = 0;

const traceFlowEdgePath = (trace) => {
    const path = [1];
    let node = trace.get(1);
    while(node !== null){
        path.push(node);
        node = trace.get(node);
    }
    return path.reverse();
};

while(true){
    let path = null;

    const queue = [0];
    const trace = new Map();
    trace.set(0, null);
    while(queue.length){
        const node = queue.shift();
        for (let child = 0; child < nodes_count; ++child) {
            if (graph_matrix[node][child] > max_path_w && !trace.has(child)) {
                trace.set(child, node);
                if (child == 1)
                    path = traceFlowEdgePath(trace);
                queue.push(child);
            }
        }
    }

    if(path === null)
        break;

    let path_w = Number.POSITIVE_INFINITY;
    let min_edge;
    for(let i = 0; i < path.length - 1; ++i){
        if(path_w > graph_matrix[path[i]][path[i + 1]]){
            path_w = graph_matrix[path[i]][path[i + 1]];
            min_edge = [path[i], path[i + 1]];
        }
    }

    max_path_w = Math.max(max_path_w, path_w);

    graph_matrix[min_edge[0]][min_edge[1]] = 0;
}

console.timeEnd("Run");
process.stdout.write(max_path_w.toString());
