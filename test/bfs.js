const expect = require('chai').expect;
import * as Gjs from '../src/Gjs';
import * as BFS from '../src/algorithms/bfs';

describe('BFS', () => {
    describe('shortestPath', () => {
        it('should return shortest path from source to target', () => {
            const gjs = new Gjs.Gjs();
            gjs.graph.addNode([{id: 0}, {id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}, {id: 6}, {id: 7}]);
            gjs.graph.addEdge([{id: 0, s: 0, t: 1}, {id: 1, s: 0, t: 2}, {id: 2, s: 3, t: 0}, {id: 3, s: 0, t: 3},
                {id: 4, s: 0, t: 3}, {id: 5, s: 0, t: 3}, {id: 6, s: 0, t: 3}, {id: 7, s: 4, t: 0}, {id: 8, s: 0, t: 4},
                {id: 9, s: 4, t: 5}, {id: 10, s: 5, t: 6}, {id: 11, s: 5, t: 7}, {id: 12, s: 6, t: 7}]);
            const path = BFS.shortestPath(gjs.graph, gjs.graph.nodesIndex.get("3"), gjs.graph.nodesIndex.get("7"));
            expect(path.map(node => node.id)).to.deep.equal([3, 0, 4, 5, 7].map(i => i.toString()));
        });
    });
});
