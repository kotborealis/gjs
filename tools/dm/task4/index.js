const Graph = require('../../../src/Graph');
const Bipartite = require('../../../src/algorithms/bipartite');

const readline = require('readline-sync');
readline.setDefaultOptions({prompt: ''});
let line;

const graph = new Graph();

line = readline.prompt();

const nodes_count = Number.parseInt(line.split(' ')[0]);
for(let i = 0; i < nodes_count; i++){
    graph.addNode({});
}

for(let i = 0; i < nodes_count; i++){
    line = readline.prompt();
    line.split(' ').forEach((capacity, j) => {
        if(Number.parseInt(capacity))
            graph.addEdge({
                s: i,
                t: j,
                weight: Number.parseInt(capacity)
            });
    });
}

console.log(Bipartite.isBipartite(graph) ? 'YES' : 'NO');
