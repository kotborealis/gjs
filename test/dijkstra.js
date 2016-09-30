const expect = require('chai').expect;
import * as Gjs from '../src/Gjs';
import * as Dijkstra from '../src/algorithms/dijkstra';

const gjs = new Gjs.Gjs();

gjs.graph.addNode([{id:1},{id:2},{id:3},{id:4},{id:5},{id:6}]);
gjs.graph.addEdge([{id:1,s:1,t:2,weight:7},{id:2,s:1,t:3,weight:9},
    {id:3,s:1,t:6,weight:14},{id:4,s:3,t:6,weight:2},
    {id:5,s:3,t:4,weight:11},{id:6,s:6,t:5,weight:9},
    {id:7,s:2,t:4,weight:15},{id:8,s:4,t:5,weight:100},
    {id:9,s:2,t:3,weight:10}]);

describe('Dijkstra', () => {
    describe('shortestPath', () => {
        it('should return shortest path', () => {
            const path = Dijkstra.shortestPath(gjs.graph, gjs.graph.nodesIndex.get("2"), gjs.graph.nodesIndex.get("5"));
            expect(path.map(node => node.id)).to.deep.equal([2, 3, 6, 5].map(i => i.toString()));
        });
    });
});
