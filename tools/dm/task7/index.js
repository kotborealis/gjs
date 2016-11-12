const Graph = require('../../../src/Graph');
const FlowNetwork = require('../../../src/algorithms/flowNetwork');

const lines = require('fs').readFileSync(process.argv[2]).toString().split('\n').map(i=>i.replace(/[\r\n]/, ''));
let line;

const graph = new Graph();

line = lines[0];

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
    line = lines[1 + i];
    const _ = line.split(' ').filter(i=>i);
    if(Number.parseInt(_.shift()) > 0) {
        _.forEach(edgeTo => {
            graph.addEdge({
                s: i + 'l',
                t: Number.parseInt(edgeTo) + 'r',
                weight: 1
            });
            graph.addEdge({
                s: Number.parseInt(edgeTo) + 'r',
                t: i + 'l',
                weight: 0
            });
        });
    }
}

const flow = FlowNetwork.FordFulkerson(graph, super_s, super_t);

let max_matching_edges_count = 0;
flow.flow.forEach((value, edge) => {
    if(edge && value && edge.s.id.toString().indexOf('l') >= 0 && edge.t.id.toString().indexOf('r') >= 0){
        max_matching_edges_count++;
    }
});

process.stdout.write(max_matching_edges_count.toString());
