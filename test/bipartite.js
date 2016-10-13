const expect = require('chai').expect;

const Graph = require('../src/Graph');
const Bipartite = require('../src/algorithms/bipartite');

describe('Bipartite', () => {
    describe('isBipartite', () => {
        it('should return true if graph is Bipartite graph (it\'s not)', () => {
            const graph = new Graph();
            graph.addNode([{},{},{}]);
            graph.addEdge([
                {s: 0, t: 1},
                {s: 1, t: 0},
                {s: 0, t: 2},
                {s: 2, t: 0},
                {s: 1, t: 2},
                {s: 2, t: 1}
            ]);

            const isBipartite = Bipartite.isBipartite(graph);
            expect(isBipartite).to.equal(false);
        });

        it('should return true if graph is Bipartite graph (YYYES, I AMMM)', () => {
            const graph = new Graph();
            graph.addNode([{},{},{},{}]);
            graph.addEdge([
                {s: 0, t: 1},
                {s: 1, t: 0},
                {s: 0, t: 3},
                {s: 3, t: 0},
                {s: 1, t: 2},
                {s: 2, t: 1},
                {s: 3, t: 2},
                {s: 2, t: 3},
            ]);

            const isBipartite = Bipartite.isBipartite(graph);
            expect(isBipartite).to.equal(true);
        });
    });
});
