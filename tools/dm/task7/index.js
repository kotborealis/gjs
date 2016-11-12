const Graph = require('../../../src/Graph');
const FlowNetwork = require('../../../src/algorithms/flowNetwork');

const lines = require('fs').readFileSync(process.argv[2]).toString().split('\n').map(i=>i.replace(/[\r\n]/, ''));
let line;

const graph = new Graph();

line = lines[0];
const [nodes_left_count, nodes_right_count] = line.split(' ').map(i => Number.parseInt(i));

const [super_s, super_t] = graph.addNode([{}, {}]);

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
    const _ = line.split(' ').filter(i=>i).map(i => Number.parseInt(i));
    if(!_.shift())
        continue;
    _.forEach(edgeTo => {
        graph.addEdge([{
            s: i + 'l',
            t: edgeTo + 'r',
            weight: 1
        }, {
            s: edgeTo + 'r',
            t: i + 'l',
            weight: 0
        }]);
    });
}

const flow = FlowNetwork.FordFulkerson(graph, super_s, super_t);

process.stdout.write(flow.capacity.toString());
