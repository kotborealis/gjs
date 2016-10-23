module.exports = function(){
    let NODE_ID_GEN_SEQ = 0;
    let EDGE_ID_GEN_SEQ = 0;

	this.nodes = new Set();
	this.edges = new Set();

	this.nodesIndex = new Map();
	this.edgesIndex = new Map();

	this.edgeBySourceTarget = new Map();

    const __node_constructor = function(){};
    const __edge_constructor = function(){};

    this.addNode = node => {
    	return Array.isArray(node) ? node.map(addNodeHelper) : addNodeHelper(node);
    };

    const addNodeHelper = node => {
    	if(node.id === undefined)
            node.id = NODE_ID_GEN_SEQ++;
    	if(this.nodesIndex.has(node.id.toString()))
    		throw new Error(`Node with id ${node.id.toString()} already exists`);

        NODE_ID_GEN_SEQ = Number.isNaN(Number.parseInt(node.id)) ?
            NODE_ID_GEN_SEQ : Math.max(Number.parseInt(node.id) + 1, NODE_ID_GEN_SEQ);

    	const node_obj = new __node_constructor();
        node_obj.id = node.id.toString();
        node_obj.render = {
            x: node.x || 0,
            y: node.y || 0,
            state: ""
        };
        node_obj.meta = {
            targetOf: new Set(),
            sourceOf: new Set(),
            neighbourNodes: new Set(),
            reverseNeighbourNodes: new Set(),
            neighbourEdges: new Set(),
            reverseNeighbourEdges: new Set()
        };

    	this.edgeBySourceTarget.set(node_obj, new Map());

    	this.nodes.add(node_obj);
    	this.nodesIndex.set(node_obj.id, node_obj);

        return node_obj;
    };

    this.addEdge = edge => {
    	return Array.isArray(edge) ? edge.map(addEdgeHelper) : addEdgeHelper(edge);
    };

    const addEdgeHelper = edge => {
    	if(edge.id === undefined)
    		edge.id = EDGE_ID_GEN_SEQ++;
        if(this.edgesIndex.has(edge.id.toString()))
            throw new Error(`Edge already exists`);
    	if(edge.s === undefined  || edge.t === undefined)
    		throw new Error(`Edge must have source and target`);
        if((!(edge.s instanceof __node_constructor) && !this.nodesIndex.has(edge.s.toString()))
            || (!(edge.t instanceof __node_constructor) && !this.nodesIndex.has(edge.t.toString())))
            throw new Error(`Edge target/source (${edge.s.toString()}/${edge.t.toString()}) node does not exists`);

        EDGE_ID_GEN_SEQ = Number.isNaN(Number.parseInt(edge.id)) ?
            EDGE_ID_GEN_SEQ : Math.max(Number.parseInt(edge.id) + 1, EDGE_ID_GEN_SEQ);

    	const edge_obj = new __edge_constructor();

    	edge_obj.id = edge.id.toString();
        edge_obj.s = edge.s instanceof __node_constructor ? edge.s : this.nodesIndex.get(edge.s.toString());
        edge_obj.t = edge.t instanceof __node_constructor ? edge.t : this.nodesIndex.get(edge.t.toString());
        edge_obj.weight = Number.isNaN(Number(edge.weight)) ? Number.POSITIVE_INFINITY : Number(edge.weight);
        edge_obj.render = {
            state: ""
        };
        edge_obj.meta = {
            reverseEdge: null,
            multipleEdges: new Set()
        };

    	edge_obj.s.meta.sourceOf.add(edge_obj);
    	edge_obj.t.meta.targetOf.add(edge_obj);

        edge_obj.s.meta.neighbourNodes.add(edge_obj.t);
        edge_obj.s.meta.neighbourEdges.add(edge_obj);

        edge_obj.t.meta.reverseNeighbourNodes.add(edge_obj.s);
        edge_obj.t.meta.reverseNeighbourEdges.add(edge_obj);

        if(!this.edgeBySourceTarget.get(edge_obj.s).has(edge_obj.t))
            this.edgeBySourceTarget.get(edge_obj.s).set(edge_obj.t, new Set([edge_obj]));
        else
            this.edgeBySourceTarget.get(edge_obj.s).get(edge_obj.t).add(edge_obj);

        this.edges.forEach(_edge => {
            if(_edge.s === edge_obj.t && _edge.t === edge_obj.s && !_edge.meta.reverseEdge){
                _edge.meta.reverseEdge = edge_obj;
                edge_obj.meta.reverseEdge = _edge;
            }
            else if(_edge.s === edge_obj.s && _edge.t === edge_obj.t){
                _edge.meta.multipleEdges.add(edge_obj);
                edge_obj.meta.multipleEdges.add(_edge);
            }
        });

      	this.edges.add(edge_obj);
      	this.edgesIndex.set(edge_obj.id, edge_obj);

        return edge_obj;
    };

    this.getNode = id => this.nodesIndex.get(id.toString());
    this.getEdge = id => this.edgesIndex.get(id.toString());

    this.getEdgeBySourceTarget = (node_s, node_t) => {
        return this.edgeBySourceTarget.get(node_s).get(node_t).values().next().value;
    };

    this.getEdgeSetBySourceTarget = (node_s, node_t) => {
        return this.edgeBySourceTarget.get(node_s).get(node_t);
    };

    this.export = () => {
        const nodes = [];
        this.nodes.forEach(node => {
            nodes.push({
                id: node.id,
                x: node.render.x,
                y: node.render.y
            });
        });

        const edges = [];
        this.edges.forEach(edge => {
            edges.push({
                id: edge.id,
                s: edge.s.id,
                t: edge.t.id,
                weight: edge.weight
            });
        });

        return {nodes, edges};
    };

    this.import = (data) => {
        this.addNode(data.nodes);
        this.addEdge(data.edges);
    };
};
