const expect = require('chai').expect;
import * as Gjs from '../src/Gjs';
import * as Dijkstra from '../src/algorithms/dijkstra';

const gjs = new Gjs.Gjs();

gjs.graph.addNode([{"id":"n1"},{"id":"n2"},{"id":"n3"},{"id":"n4"},{"id":"n5"},{"id":"n6"}]);
gjs.graph.addEdge([{"id":"e1","s":"n1","t":"n2","weight":7},{"id":"e2","s":"n1","t":"n3","weight":9},
    {"id":"e3","s":"n1","t":"n6","weight":14},{"id":"e4","s":"n3","t":"n6","weight":2},
    {"id":"e5","s":"n3","t":"n4","weight":11},{"id":"e6","s":"n6","t":"n5","weight":9},
    {"id":"e7","s":"n2","t":"n4","weight":15},{"id":"e8","s":"n4","t":"n5","weight":100},
    {"id":"e9","s":"n2","t":"n3","weight":10}]);

describe('Dijkstra', () => {
    it('should return shortest path', () => {
        const gen = Dijkstra.generator(gjs.graph, gjs.graph.nodesIndex.get("n2"));
        for(;;){
            const value = gen.next().value;
            if(value.type === "end"){
                let trace = value.trace;
                const path = Dijkstra.tracePath(gjs.graph, gjs.graph.nodesIndex.get("n2"), gjs.graph.nodesIndex.get("n5"), trace);
                expect(path.map(node => node.id)).to.deep.equal(["n2", "n3", "n6", "n5"]);
                break;
            }
        }
    });
});
