const Graph = require('../../../src/Graph');
const FlowNetwork = require('../../../src/algorithms/flowNetwork');

const readline = require('readline-sync');
readline.setDefaultOptions({prompt: ''});
let line;

const graph = new Graph();

line = readline.prompt();

const nodes_count = Number.parseInt(line.split(' ')[0]);
const edges_count = Number.parseInt(line.split(' ')[1]);
for(let i = 0; i < nodes_count; i++){
    graph.addNode({});
}

for(let i = 0; i < edges_count; i++){
    line = readline.prompt();
    graph.addEdge({
        s: Number.parseInt(line.split(' ')[0]),
        t: Number.parseInt(line.split(' ')[1]),
        weight: Number.parseInt(line.split(' ')[2]),
    });
}

const flow = FlowNetwork.FordFulkerson(graph, graph.getNode(0), graph.getNode(1));
const matrix = [];
for(let i = 0; i < nodes_count; i++){
    matrix.push([]);
}

flow.flow.forEach((value, edge) => {
    matrix[Number.parseInt(edge.s.id)][Number.parseInt(edge.t.id)] = value
});

for(let i = 0; i < nodes_count; i++){
    for(let j = 0; j < nodes_count; j++){
        if(matrix[i][j])
            process.stdout.write(matrix[i][j].toString());
        else
            process.stdout.write(0..toString());
        if(j != nodes_count - 1)
            process.stdout.write(' ');
    }
    process.stdout.write('\n');
}
