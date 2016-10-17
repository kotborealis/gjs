const Graph = require('../../../src/Graph');
const FlowNetwork = require('../../../src/algorithms/flowNetwork');

const filename = process.argv[2];
const lines = require('fs').readFileSync(filename).toString().split('\n');
let line;

const graph = new Graph();

line = lines[0];
const nodes_count = Number.parseInt(line.split(' ')[0]);
for(let i = 0; i < nodes_count; i++){
    graph.addNode({});
}

for(let i = 0; i < nodes_count; i++){
    line = lines[i + 1];
    line.split(' ').forEach((capacity, j) => {
        if(Number.parseInt(capacity))
            graph.addEdge({
                s: i,
                t: j,
                weight: Number.parseInt(capacity)
            });
    });
}

const flow = FlowNetwork.FordFulkerson(graph, graph.getNode(0), graph.getNode(1));
process.stdout.write(flow.capacity.toString());
