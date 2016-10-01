const expect = require('chai').expect;

import * as Graph from '../src/Graph';
import * as FlowNetwork from '../src/algorithms/flowNetwork';

describe('flowNetwork', () => {
    describe('maxFlowFordFulkerson', () => {
        it('should return max flow [1]', () => {
            const graph = new Graph.Graph();

            //http://i.imgur.com/nddgthq.png
            graph.addNode([
                {id: 0, x: 0, y: 0},
                {id: 1, x: 100, y: -100},
                {id: 2, x: 100, y: 100},
                {id: 3, x: 200, y: 0},
            ]);

            graph.addEdge([
                {id: 0, s: 0, t: 1, weight: 10},
                {id: 1, s: 1, t: 0, weight: 10},
                {id: 2, s: 0, t: 2, weight: 10},
                {id: 3, s: 2, t: 0, weight: 10},
                {id: 4, s: 1, t: 3, weight: 10},
                {id: 5, s: 3, t: 1, weight: 10},
                {id: 6, s: 2, t: 3, weight: 10},
                {id: 7, s: 3, t: 2, weight: 10},
                {id: 8, s: 1, t: 2, weight: 1},
                {id: 9, s: 2, t: 1, weight: 1},
            ]);

            expect(getFlowArray(graph, 0, 3)).to.deep.equal([10,-10,10,-10,10,-10,10,-10,0,0]);
        });

        it('should return max flow [2]', () => {
            const graph = new Graph.Graph();

            //http://i.imgur.com/zDm1GYa.png
            graph.addNode([
                {id: 0, x: 0, y: 0},
                {id: 1, x: 100, y: -100},
                {id: 2, x: 200, y: -100},
                {id: 3, x: 100, y: 100},
                {id: 4, x: 200, y: 100},
                {id: 5, x: 300, y: 0}
            ]);

            graph.addEdge([
                {id: 0, s: 0, t: 1, weight: 3},
                {id: 1, s: 1, t: 0, weight: 3},
                {id: 2, s: 0, t: 3, weight: 3},
                {id: 3, s: 3, t: 0, weight: 3},
                {id: 4, s: 1, t: 3, weight: 2},
                {id: 5, s: 3, t: 1, weight: 2},
                {id: 6, s: 1, t: 2, weight: 3},
                {id: 7, s: 2, t: 1, weight: 3},
                {id: 8, s: 3, t: 4, weight: 2},
                {id: 9, s: 4, t: 3, weight: 2},
                {id: 10, s: 2, t: 4, weight: 4},
                {id: 11, s: 4, t: 2, weight: 4},
                {id: 12, s: 2, t: 5, weight: 2},
                {id: 13, s: 5, t: 2, weight: 2},
                {id: 14, s: 4, t: 5, weight: 3},
                {id: 15, s: 5, t: 4, weight: 3},
            ]);

            expect(getFlowArray(graph, 0, 5)).to.deep.equal([3, -3, 2, -2, 0, 0, 3, -3, 2, -2, 1, -1, 2, -2, 3, -3]);
        });
    });
});

const getFlowArray = (graph, s, t) => {
    const flow = FlowNetwork.maxFlowFordFulkerson(graph, graph.nodesIndex.get(s.toString()), graph.nodesIndex.get(t.toString()));
    const flow_array = [];
    flow.edges.forEach(e => flow_array.push(e.weight));
    return flow_array;
};
