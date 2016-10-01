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

            expect(getFlowArray(graph, 0, 3)).to.deep.equal([10,-10,10,-10,10,-10,10,-10,0,0].sort((l, r) => l > r));
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

            expect(getFlowArray(graph, 0, 5)).to.deep.equal([3, -3, 2, -2, 0, 0, 3, -3, 2, -2, 1, -1, 2, -2, 3, -3].sort((l, r) => l > r));
        });
    });
});

const getFlowArray = (graph, s, t) => {
    const flow = FlowNetwork.maxFlowFordFulkerson(graph, graph.nodesIndex.get(s.toString()), graph.nodesIndex.get(t.toString()));
    const flow_array = [];
    flow.forEach(_ => flow_array.push(_));
    return flow_array.sort((l, r) => l > r);
};
