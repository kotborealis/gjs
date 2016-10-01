const expect = require('chai').expect;

import * as Graph from '../src/Graph';
import * as FlowNetwork from '../src/algorithms/flowNetwork';

describe('flowNetwork', () => {
    describe('maxFlowFordFulkerson', () => {
        it('should return max flow [1]', () => {
            const graph = new Graph.Graph();

            //http://i.imgur.com/nddgthq.png
            graph.addNode([{},{},{},{}]);

            graph.addEdge([
                {s: 0, t: 1, weight: 10},
                {s: 1, t: 0, weight: 10},
                {s: 0, t: 2, weight: 10},
                {s: 2, t: 0, weight: 10},
                {s: 1, t: 3, weight: 10},
                {s: 3, t: 1, weight: 10},
                {s: 2, t: 3, weight: 10},
                {s: 3, t: 2, weight: 10},
                {s: 1, t: 2, weight: 1},
                {s: 2, t: 1, weight: 1},
            ]);

            const flow = calcFlow(graph, 0, 3);
            expect(flow.flow_array).to.deep.equal([10,-10,10,-10,10,-10,10,-10,0,0].sort((l, r) => l > r));
            expect(flow.capacity).to.equal(20);
        });

        it('should return max flow [2]', () => {
            const graph = new Graph.Graph();

            //http://i.imgur.com/zDm1GYa.png
            graph.addNode([{}, {}, {}, {}, {}, {}]);

            graph.addEdge([
                {s: 0, t: 1, weight: 3},
                {s: 1, t: 0, weight: 3},
                {s: 0, t: 3, weight: 3},
                {s: 3, t: 0, weight: 3},
                {s: 1, t: 3, weight: 2},
                {s: 3, t: 1, weight: 2},
                {s: 1, t: 2, weight: 3},
                {s: 2, t: 1, weight: 3},
                {s: 3, t: 4, weight: 2},
                {s: 4, t: 3, weight: 2},
                {s: 2, t: 4, weight: 4},
                {s: 4, t: 2, weight: 4},
                {s: 2, t: 5, weight: 2},
                {s: 5, t: 2, weight: 2},
                {s: 4, t: 5, weight: 3},
                {s: 5, t: 4, weight: 3},
            ]);

            const flow = calcFlow(graph, 0, 5);
            expect(flow.flow_array).to.deep.equal([3, -3, 2, -2, 0, 0, 3, -3, 2, -2, 1, -1, 2, -2, 3, -3].sort((l, r) => l > r));
            expect(flow.capacity).to.equal(5);
        });

        it('should return max flow [3]', () => {
            const graph = new Graph.Graph();

            graph.addNode([{}, {}, {}, {}]);

            graph.addEdge([
                {s: 0, t: 1, weight: 2},
                {s: 1, t: 0, weight: 2},

                {s: 0, t: 3, weight: 3},
                {s: 3, t: 0, weight: 3},

                {s: 1, t: 2, weight: 3},
                {s: 2, t: 1, weight: 3},

                {s: 1, t: 3, weight: 5},
                {s: 3, t: 1, weight: 5},

                {s: 2, t: 3, weight: 7},
                {s: 3, t: 2, weight: 7}
            ]);

            const flow = calcFlow(graph, 0, 3);
            expect(flow.flow_array).to.deep.equal([2,-2,3,-3,0,0,2,-2,0,0].sort((l, r) => l > r));
            expect(flow.capacity).to.equal(5);
        });

        it('should return max flow [4]', () => {
            const graph = new Graph.Graph();

            graph.addNode([{}, {}, {}, {}]);

            graph.addEdge([
                {s: 0, t: 1, weight: 2},
                {s: 1, t: 0, weight: 2},

                {s: 0, t: 3, weight: 3},
                {s: 3, t: 0, weight: 3},

                {s: 1, t: 2, weight: 3},
                {s: 2, t: 1, weight: 3},

                {s: 1, t: 3, weight: 5},
                {s: 3, t: 1, weight: 5},

                {s: 2, t: 3, weight: 7},
                {s: 3, t: 2, weight: 7}
            ]);

            const flow = calcFlow(graph, 0, 2);
            expect(flow.flow_array).to.deep.equal([2,-2,3,-3,2,-2,0,0,-3,3].sort((l, r) => l > r));
            expect(flow.capacity).to.equal(5);
        });
    });
});

const calcFlow = (graph, s, t) => {
    const flow = FlowNetwork.maxFlowFordFulkerson(graph, graph.nodesIndex.get(s.toString()), graph.nodesIndex.get(t.toString()));

    flow.flow.forEach((v,k) => {
        console.log(`Edge ${k.s.id} -> ${k.t.id}, flow ${v}`);
    });
    console.log("Flow capacity", flow.capacity);

    const flow_array = [];
    flow.flow.forEach(_ => flow_array.push(_));
    flow.flow_array = flow_array.sort((l, r) => l > r);

    return flow;
};
