const Graph = require('../../../src/Graph');
const FlowNetwork = require('../../../src/algorithms/flowNetwork');

const readline = require('readline-sync');
readline.setDefaultOptions({prompt: ''});
let line;

const graph = new Graph();

line = readline.prompt();

const nodes_left_count = Number.parseInt(line.split(' ')[0]);
const nodes_right_count = Number.parseInt(line.split(' ')[1]);

const super_s = graph.addNode({id: 'super_s'});
const super_t = graph.addNode({id: 'super_t'});

for(let i = 0; i < nodes_left_count; i++){
    graph.addEdge({
        s: super_s.id,
        t: graph.addNode({id: i+'l'}).id,
        weight: 1
    });
}
for(let i = 0; i < nodes_right_count; i++){
    graph.addEdge({
        s: graph.addNode({id: i+'r'}).id,
        t: super_t.id,
        weight: 1
    });
}

for(let i = 0; i < nodes_left_count; i++){
    line = readline.prompt();
    if(line.length)
        line.split(' ').forEach(edgeTo => {
            graph.addEdge({
                s: i + 'l',
                t: Number.parseInt(edgeTo) + 'r',
                weight: 1
            });
            graph.addEdge({
                s: Number.parseInt(edgeTo) + 'r',
                t: i + 'l',
                weight: 1
            });
        });
}

const flow = FlowNetwork.FordFulkerson(graph, super_s, super_t);

let max_matching_edges_count = 0;
flow.flow.forEach((value, edge) => {
    if(edge && value === 1 && edge.s !== super_s && edge.t !== super_t) {
        max_matching_edges_count++;
    }
});

console.log(max_matching_edges_count);
