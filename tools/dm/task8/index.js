const Graph = require('../../../src/Graph');
const FlowNetwork = require('../../../src/algorithms/flowNetwork');

const lines = require('fs').readFileSync(process.argv[2]).toString().split('\n').map(i=>i.replace(/[\r\n]/, ''));
let line;

const graph = new Graph();

line = lines[0];
const [nodes_rows_count, nodes_cols_count] = line.split(' ').map(i => Number.parseInt(i));

const [super_s, super_t] = graph.addNode([{}, {}]);

line = lines[1];
line.split(' ').filter(i=>i).map(i=>Number.parseInt(i)).forEach((constrain, i) => {
    graph.addEdge({
        s: super_s,
        t: graph.addNode({id: i+'row'}),
        weight: constrain
    });
});

line = lines[2];
line.split(' ').filter(i=>i).map(i=>Number.parseInt(i)).forEach((constrain, i) => {
    graph.addEdge({
        s: graph.addNode({id: i+'col'}),
        t: super_t,
        weight: constrain
    });
});

for(let i = 0; i < nodes_rows_count; i++){
    for(let k = 0; k < nodes_cols_count; k++) {
        graph.addEdge({
            s: i + 'row',
            t: k + 'col',
            weight: Number.POSITIVE_INFINITY
        });
    }
}

const flow = FlowNetwork.FordFulkerson(graph, super_s, super_t);

process.stdout.write(flow.capacity.toString());
