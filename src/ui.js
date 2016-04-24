'use strict';
const gui = new dat.GUI();

window.___={};window.___.fileName="";
const fileLoader = gui.add(window.___,'fileName');
fileLoader.onFinishChange((fileName)=>g.loadFromFile("tests/"+fileName));

const fileLoaderQuickSelect = gui.add(window.___,'fileName',["flow1.json","flow2.json","sptree1.json","Basic1.json","Dijkstra1.json"]);;
fileLoaderQuickSelect.onFinishChange((fileName)=>g.loadFromFile("tests/"+fileName));

gui.add(g,'saveFile');

const options = gui.addFolder("Display");
options.add(g.camera.options.display,'id');
options.add(g.camera.options.display,'label');
options.add(g.camera.options.display,'value');
options.add(g.camera.options.display,'weight');

const circle_layout = gui.addFolder("Circle Layout");
circle_layout.add(g.layout.circle,'radius',100,600);
circle_layout.add(g,'layoutCircle');

const grid_layout = gui.addFolder("Grid Layout");
grid_layout.add(g.layout.grid,'offset',50,500);
grid_layout.add(g.layout.grid,'row',1,10).step(1);
grid_layout.add(g,'layoutGrid');

const bipartite_layout = gui.addFolder("Bipartite Layout");
bipartite_layout.add(g.layout.bipartite,'partOffset',50,500);
bipartite_layout.add(g.layout.bipartite,'elementOffset',50,500);
bipartite_layout.add(g.layout.bipartite,'direction',['horizontal','vertical']);
bipartite_layout.add(g,'layoutBipartite');

const pathFinder = gui.addFolder("Path Finder");
pathFinder.add(g,'pathFinderFunction',["BFSPath","DijkstraPath"]);

const funcs = gui.addFolder("Functions");
funcs.add(g,'searchMinCycle');
funcs.add(g,'isBipartite');
funcs.add(g,'spanningTreeMin');
funcs.add(g,'isFlowNetwork');