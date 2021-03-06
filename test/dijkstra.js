const expect = require('chai').expect;

const Graph = require('../src/Graph');
const Dijkstra = require('../src/algorithms/dijkstra');

describe('Dijkstra', () => {
    describe('shortestPath', () => {
        it('should return shortest path', () => {
            const graph = new Graph();
            graph.addNode([{id:1},{id:2},{id:3},{id:4},{id:5},{id:6}]);
            graph.addEdge([
                {s:1,t:2,weight:7},
                {s:1,t:3,weight:9},
                {s:1,t:6,weight:14},
                {s:3,t:6,weight:2},
                {s:3,t:4,weight:11},
                {s:6,t:5,weight:9},
                {s:2,t:4,weight:15},
                {s:4,t:5,weight:100},
                {s:2,t:3,weight:10}]);
            const path = Dijkstra.shortestPath(graph, graph.getNode(2), graph.getNode(5));
            console.log(`Path: ${path.map(node => node.id).join(', ')}`);
            expect(path.map(node => node.id)).to.deep.equal([2, 3, 6, 5].map(i => i.toString()));
        });
    });
});
