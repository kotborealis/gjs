const Graph = require('../../../src/Graph');
const FlowNetwork = require('../../../src/algorithms/flowNetwork');

const lines = require('fs').readFileSync(process.argv[2]).toString().split('\n').map(i=>i.replace(/[\r\n]/, ''));
let line;

const graph = new Graph();

const nodes_right_count = Number.parseInt(lines[0]);
const nodes_left_count = lines[1].split('').length;

const super_s = graph.addNode({id: 'super_s'});
const super_t = graph.addNode({id: 'super_t'});

const desired_word = lines[1].split('');
const right_node_to_value = new Map();

for(let i = 0; i < nodes_right_count; i++){
    line = lines[2 + i];
    const _ = graph.addNode({id: i+"r"});
    graph.addEdge({
        s: _,
        t: super_t,
        weight: 1
    });
    right_node_to_value.set(_.id, line.split(''));
}

for(let i = 0; i < nodes_left_count; i++){
    const _ = graph.addNode({id: i+"l"});
    graph.addEdge({
        s: super_s,
        t: _,
        weight: 1
    });
}

for(let i = 0; i < nodes_left_count; i++){
    for(let k = 0; k < nodes_right_count; k++){
        if(right_node_to_value.get(k+'r').indexOf(desired_word[i]) >= 0){
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

process.stdout.write(flow.capacity === desired_word.length ? "YES" : "NO");
