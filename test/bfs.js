const expect = require('chai').expect;
import * as Gjs from '../src/Gjs';
import * as BFS from '../src/algorithms/bfs';

const gjs = new Gjs.Gjs();

gjs.graph.addNode([{id: 0}, {id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}, {id: 6}, {id: 7}]);
gjs.graph.addEdge([{id: 0, s: 0, t: 1}, {id: 1, s: 0, t: 2}, {id: 2, s: 0, t: 3}, {id: 3, s: 0, t: 3},
    {id: 4, s: 0, t: 3}, {id: 5, s: 0, t: 3}, {id: 6, s: 0, t: 3}, {id: 7, s: 4, t: 0}, {id: 8, s: 0, t: 4},
    {id: 9, s: 4, t: 5}, {id: 10, s: 5, t: 6}, {id: 11, s: 5, t: 7}]);

describe('BFS', () => {
    describe('generator', () => {
        it('should go through all nodes', () => {
            const gen = BFS.generator(gjs.graph, gjs.graph.nodesIndex.get("0"));
            for(;;){
                const value = gen.next().value;
                if(value.type === "end"){
                    const nodes = [];
                    value.trace.forEach((value, key) => nodes.push(key.id));
                    expect(nodes).to.deep.equal([0, 1, 2, 3, 4, 5, 6, 7].map(i => i.toString()));
                    break;
                }
            }
        });
    });
    describe('tracePath', () => {
        it('should trace path to node', () => {
            const gen = BFS.generator(gjs.graph, gjs.graph.nodesIndex.get("0"));
            for(;;){
                const value = gen.next().value;
                if(value.type === "end"){
                    let trace = value.trace;
                    const path = BFS.tracePath(gjs.graph, gjs.graph.nodesIndex.get("0"), gjs.graph.nodesIndex.get("7"), trace);
                    expect(path.map(node => node.id)).to.deep.equal([0, 4, 5, 7].map(i => i.toString()));
                    break;
                }
            }
        });
    });
});
