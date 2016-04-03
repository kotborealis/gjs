'use strict';

const cameraSettings = {
    viewport:{x:-400,y:-400},
    nodeColor:{
        "":"#DD5A5A",
        "hover":"#4E9999",
        "highlight":"#768DCC",
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
        "trace":"#CE44F4",
        "cycle":"#A1F69B"
    },
    edgeWidth:{
        "":4
    }
};

function Camera(canvasManager,g,cfg){
    cfg=cfg||cameraSettings;

    const ctx = canvasManager.ctx;
    this.viewportOffset={x:0,y:0};

    let zoomFactor=1;

    const redraw = ()=>{
        startRender();
        edgeRender();
        nodeRender();
        endRender();
        //setTimeout(redraw,50);
        requestAnimationFrame(redraw);
    };
    requestAnimationFrame(redraw);
    //setTimeout(redraw,50);

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
            ctx.font=font_size+"px Arial";
            ctx.fillStyle="#0c0c0c";
            if(this.options.display.label===true && node.label!=="") {
                ctx.fillText(node.label, node.x + node.size, node.y + offset);
                offset+=font_size;
            }
            if(this.options.display.id===true) {
                ctx.fillText(node.id, node.x + node.size, node.y + offset);
                offset+=font_size;
            }
            if(this.options.display.value===true) {
                ctx.fillText(JSON.stringify(node.value), node.x + node.size, node.y + offset);
                offset+=font_size;
            }
        });
    };

    const edgeRender = ()=>{
        ctx.lineWidth=cfg.edgeWidth[""];
        ctx.font="16px Arial";
        ctx.fillStyle="#0c0c0c";
        g.edgesArray.map((edge)=>{
            ctx.strokeStyle=cfg.edgeColor.hasOwnProperty(edge.prop)?cfg.edgeColor[edge.prop]:cfg.edgeColor[""];
            ctx.beginPath();
            ctx.moveTo(g.nodesIndex[edge.s].x,g.nodesIndex[edge.s].y);
            ctx.lineTo(g.nodesIndex[edge.t].x,g.nodesIndex[edge.t].y);
            ctx.stroke();
            ctx.closePath();
            if(this.options.display.weight===true) {
                const edgeText = edge.weight === Number.POSITIVE_INFINITY ? "inf" : edge.weight;
                let edgeTextX = g.nodesIndex[edge.s].x + g.nodesIndex[edge.t].x;
                edgeTextX /= 2;
                let edgeTextY = g.nodesIndex[edge.s].y + g.nodesIndex[edge.t].y;
                edgeTextY /= 2;
                ctx.fillText(edgeText, edgeTextX, edgeTextY);
            }
        });
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
            zoomFactor-=dy/(2000/zoomFactor);
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
}