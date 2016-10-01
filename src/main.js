import * as Gjs from './Gjs';
import * as Flow from './algorithms/flowNetwork';

const gjs = new Gjs.Gjs("#gcanvas");

gjs.graph.addNode([
    {id: 0, x: 0, y: 0},
    {id: 1, x: 100, y: -100},
    {id: 2, x: 200, y: -100},
    {id: 3, x: 100, y: 100},
    {id: 4, x: 200, y: 100},
    {id: 5, x: 300, y: 0}
]);

gjs.graph.addEdge([
    {id: 0, s: 0, t: 1, weight: 3},
    {id: 1, s: 1, t: 0, weight: 0},
    {id: 2, s: 0, t: 3, weight: 3},
    {id: 3, s: 3, t: 0, weight: 0},
    {id: 4, s: 1, t: 3, weight: 2},
    {id: 5, s: 3, t: 1, weight: 0},
    {id: 6, s: 1, t: 2, weight: 3},
    {id: 7, s: 2, t: 1, weight: 0},
    {id: 8, s: 3, t: 4, weight: 2},
    {id: 9, s: 4, t: 3, weight: 0},
    {id: 10, s: 2, t: 4, weight: 4},
    {id: 11, s: 4, t: 2, weight: 0},
    {id: 12, s: 2, t: 5, weight: 2},
    {id: 13, s: 5, t: 2, weight: 0},
    {id: 14, s: 4, t: 5, weight: 3},
    {id: 15, s: 5, t: 4, weight: 0},
]);

Flow.maxFlowFordFulkerson(gjs.graph, gjs.graph.nodesIndex.get("0"), gjs.graph.nodesIndex.get("5"));
