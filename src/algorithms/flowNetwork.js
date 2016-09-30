import * as BFS from './bfs';

export const maxFlowFordFulkerson = function (graph, source, target){
    throw new Error("WIP");
    const constrains = graph.clone();
    const flow = graph.clone();

    const constrains_source = constrains.nodesIndex.get(source.id);
    const constrains_target = constrains.nodesIndex.get(target.id);

    const flow_source = flow.nodesIndex.get(source.id);
    const flow_target = flow.nodesIndex.get(target.id);

    flow.edges.forEach(edge => {edge.weight = 0;});

    const bfs_gen = BFS.generator(constrains, constrains_source);

    for(;;){
        const value = bfs_gen.next().value;
        if(value.type === "node"){
            if(value.node === constrains_target){
                const path = BFS.tracePath(constrains, constrains_source, constrains_target, value.trace);
                let path_w = Number.POSITIVE_INFINITY;

                for(let i = 0; i < path.length - 1; i++){
                    const constrains_s = constrains.nodesIndex.get(path[i].id);
                    const constrains_t = constrains.nodesIndex.get(path[i+1].id);

                    const w = constrains.getEdgeBySourceTarget(constrains_s, constrains_t).weight;
                    path_w = Math.min(path_w, w);
                }

                if(path_w === 0)
                    continue;

                for(let i = 0; i < path.length - 1; i++){
                    const constrains_s = constrains.nodesIndex.get(path[i].id);
                    const constrains_t = constrains.nodesIndex.get(path[i+1].id);

                    const flow_s = flow.nodesIndex.get(path[i].id);
                    const flow_t = flow.nodesIndex.get(path[i+1].id);

                    constrains.getEdgeBySourceTarget(constrains_s, constrains_t).weight -= path_w;
                    constrains.getEdgeBySourceTarget(constrains_t, constrains_s).weight -= path_w;

                    flow.getEdgeBySourceTarget(flow_s, flow_t).weight += path_w;
                    flow.getEdgeBySourceTarget(flow_t, flow_s).weight -= path_w;
                }
            }
        }
        else if(value.type === "end"){
            break;
        }
    }
    console.log("MAX FLOW");
    flow.edges.forEach(e => {
        console.log(`Edge ${e.s.id} -> ${e.t.id}: ${e.weight}`);
    });
};
