const BFS = require('./bfs');

const isBipartite = function(graph){
    const root = [...graph.nodes].shift();
    const trace = new Map();
    trace.set(root, true);

    const gen = BFS.generator(graph, root);
    for(;;){
        const value = gen.next().value;
        if(value.type === "child"){
            if(!trace.has(value.child)){
                trace.set(value.child, !trace.get(value.node));
            }
            else if(trace.get(value.child) === trace.get(value.node)){
                return false;
            }
        }
        else if(value.type === "end"){
            return true;
        }
    }
};

module.exports = {isBipartite};
