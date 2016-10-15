const Graph = require('../../../src/Graph');
const FlowNetwork = require('../../../src/algorithms/flowNetwork');

const readline = require('readline-sync');
readline.setDefaultOptions({prompt: ''});
let line;

const graph = new Graph();
const flow = new Map();

line = readline.prompt();

const nodes_count = Number.parseInt(line.split(' ')[0]);
const edges_count = Number.parseInt(line.split(' ')[1]);
for(let i = 0; i < nodes_count; i++){
    graph.addNode({});
}

for(let i = 0; i < edges_count; i++){
    line = readline.prompt();
    const edge = graph.addEdge({
        s: Number.parseInt(line.split(' ')[0]),
        t: Number.parseInt(line.split(' ')[1]),
        weight: Number.parseInt(line.split(' ')[3]),
    });
    flow.set(edge, Number.parseInt(line.split(' ')[2]));
}

const path = FlowNetwork.findFlowEdgePath(graph, flow, graph.getNode(0), graph.getNode(1));

console.log(path ? 'NO' : 'YES');
