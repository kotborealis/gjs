import * as Gjs from './Gjs';

const gjs = new Gjs.Gjs("#gcanvas");

gjs.graph.addNode([
	{
		id: 0,
		x: 0,
		y: 0
	},
	{
		id: 1,
		x: 100,
		y: 100
	},
	{
		id: 2,
		x: 200,
		y: 100
	},
    {
        id: 3,
        x: -200,
        y: -300
    },
    {
        id: 4,
        x: 200,
        y: 300
    },
    {
        id: 5,
        x: 220,
        y: 300
    },
    {
        id: 6,
        x: 240,
        y: 300
    },
    {
        id: "аррр",
        x: 240,
        y: 340
    }
]);

gjs.graph.addEdge([
	{
		id: 0,
		s: 0,
		t: 1
	},
	{
		id: 1,
		s: 0,
		t: 2
	},
	{
		id: 2,
		s: 0,
		t: 3
	},
	{
		id: 3,
		s: 0,
		t: 3
	},
	{
		id: 4,
		s: 0,
		t: 3
	},
	{
		id: 5,
		s: 0,
		t: 3
	},
    {
        id: 6,
        s: 0,
        t: 3
    },
    {
        id: 7,
        s: 4,
        t: 0
    },
    {
        id: 8,
        s: 0,
        t: 4
    },
    {
        id: 9,
        s: 4,
        t: 5
    },
    {
        id: 10,
        s: 5,
        t: 6
    },
    {
        id: 11,
        s: 5,
        t: "аррр"
    }
]);

import * as BFS from './algorithms/bfs';

const bfs_gen = BFS.generator(gjs.graph, gjs.graph.nodesIndex.get("0"));

for(;;){
    const a = bfs_gen.next();
    if(a.value.node === gjs.graph.nodesIndex.get("аррр")){
        console.log(BFS.tracePath(gjs.graph, gjs.graph.nodesIndex.get("0"), gjs.graph.nodesIndex.get("аррр"), a.value.trace));
        break;
    }
}
