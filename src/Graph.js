'use strict';

function Graph(settings){
    const self = this;

    let _NODE_ID_GEN = 0;
    let _EDGE_ID_GEN = 0;
    settings = settings || {};

    /**
     * Arrays of nodes and edges
     * @type {Array}
     */
    this.nodesArray=[];
    this.edgesArray=[];

    /**
     * Index of nodes and edges
     * @type {{}}
     */
    this.nodesIndex={};
    this.edgesIndex={};

    /**
     * Node neighbour nodes and edges
     */
    this.nodeNeighbourNodes = {};
    this.nodeNeighbourEdges = {};

    /**
     * Add node/nodes to graph
     * @param {Array|Object} node
     */
    this.addNode = function(node){
        node = Array.isArray(node) ? node : [node];
        node.map((i)=>__addNode(i));
    };
    /**
     * Add edge/edges to graph
     * @param {Array|Object} edge
     */
    this.addEdge = function(edge){
        edge = Array.isArray(edge) ? edge : [edge];
        edge.map((i)=>__addEdge(i));
    };

    this.createNode = function(x,y){
        return __addNode({id:"NODE!!_"+_NODE_ID_GEN++,x,y});
    };
    this.createEdge = function(s,t){
        return __addEdge({id:"EDGE!!_"+_EDGE_ID_GEN++,s,t});
    };

    this.getEdgeIdByST = (source,target)=>{
        for(let i=0;i<this.nodeNeighbourEdges[source].length;i++){
            const id = this.nodeNeighbourEdges[source][i];
            const edge = this.edgesIndex[id];
            if(edge.s === source && edge.t === target ||
                edge.t === source && edge.s === target)
                return id;
        }
        return null;
    };

    this.clear = ()=>{
        this.nodesArray=[];
        this.edgesArray=[];
        this.nodesIndex={};
        this.edgesIndex={};
        this.nodeNeighbourNodes={};
        this.nodeNeighbourEdges={};
    };

    this.getAdjacencyMatrix = ()=>{
        let matrix = [];
        for(let i=0;i<this.nodesArray.length;i++) {
            matrix[i]=[];
            for(let j=0;j<this.nodesArray.length;j++)
                if(this.nodeNeighbourNodes[this.nodesArray[i].id].includes(this.nodesArray[j].id))
                    matrix[i][j] = 1;
                else
                    matrix[i][j] = 0;
        }
        return matrix;
    };

    const __addNode = function(node){
        if(!node.id || (typeof node.id!=='string' && typeof node.id!=='number'))
            throw new Error("Invalid node ID");
        if(self.nodesIndex[node.id])
            throw new Error("Node already exists");

        const _node={};
        _node.label=node.label||"";
        _node.size=node.size||10;
        _node.id = node.id;
        _node.value=node.value||{};

        _node.x = node.x||0;
        _node.y = node.y||0;

        _node.active = false;
        _node.highlight = false;

        self.nodesArray.push(_node);
        self.nodesIndex[_node.id]=_node;
        self.nodeNeighbourNodes[_node.id]=[];
        self.nodeNeighbourEdges[_node.id]=[];

        return _node.id;
    };

    const __addEdge = function(edge){
        if(!edge.id || (typeof edge.id!=='string' && typeof edge.id!=='number'))
            throw new Error("Invalid edge ID");
        if(!edge.t || (typeof edge.t!=='string' && typeof edge.t!=='number'))
            throw new Error("Invalid edge Target node");
        if(!edge.s || (typeof edge.s!=='string' && typeof edge.s!=='number'))
            throw new Error("Invalid edge Source node");
        if(!self.nodesIndex[edge.s])
            throw new Error("Edge Source node not exists");
        if(!self.nodesIndex[edge.t])
            throw new Error("Edge Target node not exists");
        if(self.edgesIndex[edge.id])
            throw new Error("Edge already exists");

        const _edge = {};
        _edge.id = edge.id;
        _edge.s = edge.s;
        _edge.t = edge.t;
        _edge.weight = edge.weight || Number.POSITIVE_INFINITY;
        _edge.directed = edge.directed || false;

        self.edgesArray.push(_edge);
        self.edgesIndex[_edge.id]=_edge;

        if(!_edge.directed){
            self.nodeNeighbourNodes[_edge.t].push(_edge.s);
            self.nodeNeighbourEdges[_edge.t].push(_edge.id);
        }

        self.nodeNeighbourNodes[_edge.s].push(_edge.t);
        self.nodeNeighbourEdges[_edge.s].push(_edge.id);

        self.nodeNeighbourNodes[_edge.t].sort();
        self.nodeNeighbourEdges[_edge.t].sort();

        self.nodeNeighbourNodes[_edge.s].sort();
        self.nodeNeighbourEdges[_edge.s].sort();

        self.nodesArray.sort((a,b)=>a.id.localeCompare(b.id));

        return _edge.id;
    };
}
