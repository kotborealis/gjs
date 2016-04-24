const cameraSettings = {
    viewport:{x:-400,y:-400},
    nodeColor:{
        "":"#DD5A5A",
        "hover":"#4E9999",
        "highlight":"#768DCC",
        "highlight2":"#76DDAC",
        "trace":"#CE44F4",
        "trace_s":"#5021CC",
        "trace_t":"#CC1205",
        "cycle":"#A1F69B",
        "bipartite1":"#FF5600",
        "bipartite2":"#0065FF"
    },
    bgColor:"#F2F5FC",
    edgeColor:{
        "":"#E87C7C",
        "highlight":"#94A4CC",
        "highlight2":"#94D4AC",
        "trace":"#CE44F4",
        "cycle":"#A1F69B",
        "spanning_tree":"#26ca8f"
    },
    edgeWidth:{
        "":4
    },
    multipleEdgeOffset:20,
    arrowOffset:{
        x:10,
        y:10
    }
};

module.exports = function (canvasManager,g,cfg){
    cfg=cfg||cameraSettings;

    const _slow_render = localStorage.getItem("slowRender");

    const ctx = canvasManager.ctx;
    this.viewportOffset={x:0,y:0};

    let zoomFactor=1;

    let drawedEdgesByST={};

    const redraw = ()=>{
        startRender();
        edgeRender();
        nodeRender();
        endRender();
        if(_slow_render!==null)
            setTimeout(()=>requestAnimationFrame(redraw),_slow_render);
        else
            requestAnimationFrame(redraw);
    };
    requestAnimationFrame(redraw);

    const startRender = ()=>{
        canvasManager.clear(cfg.bgColor);
        ctx.save();
        ctx.scale(zoomFactor,zoomFactor);
        ctx.translate(-viewport().x,-viewport().y);
    };

    const endRender = ()=>{
        ctx.restore();
    };

    const nodeRender = ()=>{
        g.nodesArray.map((node)=>{
            ctx.fillStyle=cfg.nodeColor.hasOwnProperty(node.prop)?cfg.nodeColor[node.prop]:cfg.nodeColor[""];
            ctx.beginPath();
            ctx.arc(node.x,node.y,node.size,0,2*Math.PI,false);
            ctx.fill();
            ctx.closePath();

            const font_size = node.size+5;
            let offset=-font_size/2;
            ctx.font=font_size+"px monospace";
            ctx.fillStyle="#0c0c0c";
            if(this.options.display.label===true && node.label!=="") {
                ctx.fillText(node.label, node.x + node.size, node.y + offset);
                offset=offset+font_size;
            }
            if(this.options.display.id===true) {
                ctx.fillText(node.id, node.x + node.size, node.y + offset);
                offset=offset+font_size;
            }
            if(this.options.display.value===true)
                ctx.fillText(JSON.stringify(node.value), node.x + node.size, node.y + offset);
        });
    };

    const edgeRender = ()=>{
        drawedEdgesByST={};
        ctx.lineWidth=cfg.edgeWidth[""];
        ctx.font="16px monospace";
        ctx.fillStyle="#0c0c0c";
        g.edgesArray.map((edge)=>{
            const offsetI = [edge.s,edge.t].sort();
            drawedEdgesByST[offsetI]=drawedEdgesByST[offsetI]||[];
            if(drawedEdgesByST[offsetI].indexOf(edge.id)<0)
                drawedEdgesByST[offsetI].push(edge.id);
            drawEdge(edge,offsetI);
        });
    };

    const drawEdge = (edge,offsetI)=>{
        const cOffset = drawedEdgesByST[offsetI].indexOf(edge.id);
        const s={x:g.nodesIndex[edge.s].x,y:g.nodesIndex[edge.s].y};
        const t={x:g.nodesIndex[edge.t].x,y:g.nodesIndex[edge.t].y};
        const distance = Math.sqrt(Math.pow(t.x-s.x,2)+Math.pow(t.y-s.y,2));
        const angle = Math.atan2(t.y-s.y,t.x-s.x);
        const offset={x:distance/2,y:cOffset*cfg.multipleEdgeOffset};
        ctx.strokeStyle=cfg.edgeColor.hasOwnProperty(edge.prop)?cfg.edgeColor[edge.prop]:cfg.edgeColor[""];
        ctx.save();
        ctx.translate(s.x,s.y);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(0,0);
        ctx.bezierCurveTo(offset.x,offset.y,offset.x,offset.y,distance,0);
        ctx.stroke();
        ctx.closePath();
        if(edge.directed){
            ctx.beginPath();
            ctx.moveTo(distance-cfg.arrowOffset.x,0);
            ctx.lineTo(distance-cfg.arrowOffset.x*2,-cfg.arrowOffset.y);
            ctx.moveTo(distance-cfg.arrowOffset.x,0);
            ctx.lineTo(distance-cfg.arrowOffset.x*2,cfg.arrowOffset.y);
            ctx.stroke();
            ctx.closePath();
        }
        if(this.options.display.weight===true) {
            const edgeText = edge.weight === Number.POSITIVE_INFINITY ? "inf" : edge.weight;
            if(angle<-Math.PI/2 || angle>Math.PI/2) {
                ctx.save();
                ctx.rotate(Math.PI);
                ctx.fillText(edgeText, -offset.x, -offset.y);
                ctx.restore();
            }
            else
                ctx.fillText(edgeText, offset.x, offset.y);
        }
        ctx.restore();
    };

    const viewport = ()=>{
        const x = (cfg.viewport.x-this.viewportOffset.x)/zoomFactor;
        const y = (cfg.viewport.y-this.viewportOffset.y)/zoomFactor;
        return {x,y};
    };

    this.zoom = (dy)=>{
        if(dy===undefined)
            return zoomFactor;
        else
            zoomFactor=zoomFactor-dy/(2000/zoomFactor);
    };

    this.viewportCoords = (x,y)=>{
        x = x/zoomFactor+viewport().x;
        y = y/zoomFactor+viewport().y;
        return {x,y};
    };

    //GUI vars
    this.options={};
    this.options.display={};
    this.options.display.id=true;
    this.options.display.label=true;
    this.options.display.value=true;
    this.options.display.weight=true;
};
