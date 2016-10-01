import * as Gjs from './Gjs';
import * as Flow from './algorithms/flowNetwork';

const gjs = new Gjs.Gjs("#gcanvas");

gjs.graph.addNode([
    {id: 0, x: 0, y: 0},
    {id: 1, x: 100, y: -100},
    {id: 2, x: 100, y: 100},
    {id: 3, x: 200, y: 0},
]);

gjs.graph.addEdge([
    {id: 0, s: 0, t: 1, weight: 10},
    {id: 1, s: 1, t: 0, weight: 0},
    {id: 2, s: 0, t: 2, weight: 10},
    {id: 3, s: 2, t: 0, weight: 0},
    {id: 4, s: 1, t: 3, weight: 10},
    {id: 5, s: 3, t: 1, weight: 0},
    {id: 6, s: 2, t: 3, weight: 10},
    {id: 7, s: 3, t: 2, weight: 0},
    {id: 8, s: 1, t: 2, weight: 1},
    {id: 9, s: 2, t: 1, weight: 0},
]);
