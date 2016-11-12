const Graph = require('../../../src/Graph');
const FlowNetwork = require('../../../src/algorithms/flowNetwork');

const lines = require('fs').readFileSync(process.argv[2]).toString().split('\n').map(i=>i.replace(/[\r\n]/, ''));
let line;

const graph = new Graph();

const nodes_left_count = lines[1].split('').length;
const nodes_right_count = Number.parseInt(lines[0]);

const [super_s, super_t] = graph.addNode([{}, {}]);

const word = lines[1].split('');
const cube_values = new Map();

for(let i = 0; i < nodes_left_count; i++){
    graph.addEdge({
        s: super_s,
        t: graph.addNode({id: i+"l"}),
        weight: 1
    });
}

for(let i = 0; i < nodes_right_count; i++){
    line = lines[2 + i];
    graph.addEdge({
        s: graph.addNode({id: i+"r"}),
        t: super_t,
        weight: 1
    });
    cube_values.set(i+"r", line.split(''));
}

for(let i = 0; i < nodes_left_count; i++){
    for(let k = 0; k < nodes_right_count; k++){
        if(cube_values.get(k+'r').indexOf(word[i]) >= 0){
            graph.addEdge([{
                s: i+'l',
                t: k+'r',
                weight: 1
            }, {
                s: k+'r',
                t: i+'l',
                weight: 0
            }]);
        }
    }
}

const flow = FlowNetwork.FordFulkerson(graph, super_s, super_t);

process.stdout.write(flow.capacity === word.length ? "YES" : "NO");
