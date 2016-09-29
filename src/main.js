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
    }
]);
