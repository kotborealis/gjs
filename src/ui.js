var gui = new dat.GUI();

var options = gui.addFolder("Display");
options.add(g.camera.options.display,'id');
options.add(g.camera.options.display,'label');
options.add(g.camera.options.display,'value');
options.add(g.camera.options.display,'weight');

var circle_layout = gui.addFolder("Circle Layout");
circle_layout.add(g.layout.circle,'radius',100,600);
circle_layout.add(g,'layoutCircle');

var circle_layout = gui.addFolder("Grid Layout");
circle_layout.add(g.layout.grid,'offset',50,500);
circle_layout.add(g.layout.grid,'row',1,10).step(1);
circle_layout.add(g,'layoutGrid');

var bipartite_layout = gui.addFolder("Bipartite Layout");
bipartite_layout.add(g.layout.bipartite,'partOffset',50,500);
bipartite_layout.add(g.layout.bipartite,'elementOffset',50,500);
bipartite_layout.add(g.layout.bipartite,'direction',['horizontal','vertical']);
bipartite_layout.add(g,'layoutBipartite');

var pathFinder = gui.addFolder("Path Finder");
pathFinder.add(g,'pathFinderFunction',["BFSPath","DijkstraPath"]);

var funcs = gui.addFolder("Functions");
funcs.add(g,'searchMinCycle');
funcs.add(g,'isBipartite');