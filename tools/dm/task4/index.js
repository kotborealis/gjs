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
    const adj = line.split(' ').map((isAdj, j) => Number.parseInt(isAdj) * (i < j ? 1 : -1));
    adj.forEach((isAdj, j) => {
        if(isAdj > 0){
            graph.addEdge({
                s: i,
                t: j,
                weight: 0
            });
        }
        else if(isAdj < 0){
            graph.addEdge({
                s: j,
                t: i,
                weight: 0
            });
        }
    });
}

console.log(Bipartite.isBipartite(graph) ? 'YES' : 'NO');
