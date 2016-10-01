const expect = require('chai').expect;

import Graph from '../src/Graph';
import * as BFS from '../src/algorithms/bfs';

describe('BFS', () => {
    describe('shortestPath', () => {
        it('should return shortest path from source to target', () => {
            const graph = new Graph();
            graph.addNode([{},{},{},{},{},{},{},{}]);
            graph.addEdge([
                {s: 0, t: 1},
                {s: 0, t: 2},
                {s: 3, t: 0},
                {s: 0, t: 3},
                {s: 0, t: 3},
                {s: 0, t: 3},
                {s: 0, t: 3},
                {s: 4, t: 0},
                {s: 0, t: 4},
                {s: 4, t: 5},
                {s: 5, t: 6},
                {s: 5, t: 7},
                {s: 6, t: 7}
                ]);
            const path = BFS.shortestPath(graph, graph.nodesIndex.get("3"), graph.nodesIndex.get("7"));
            expect(path.map(node => node.id)).to.deep.equal([3, 0, 4, 5, 7].map(i => i.toString()));
        });
    });
});
