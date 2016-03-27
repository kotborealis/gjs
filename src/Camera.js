'use strict';

const cameraSettings = {
    viewport:{x:-400,y:-400},
    nodeColor:{
        "":"#DD5A5A",
        "hover":"#4E9999",
        "highlight":"#768DCC",
        "trace":"#CE44F4",
        "trace_s":"#5021CC",
        "trace_t":"#CC1205"
    },
    bgColor:"#F2F5FC",
    edgeColor:{
        "":"#E87C7C",
        "highlight":"#94A4CC",
        "trace":"#CE44F4"
    },
    edgeWidth:{
        "":4
    }
};

function Camera(canvasManager,g,cfg){
    cfg=cfg||cameraSettings;

    const ctx = canvasManager.ctx;
    this.viewportOffset={x:0,y:0};

    const redraw = ()=>{
        startRender();
        edgeRender();
        nodeRender();
        endRender();
        requestAnimationFrame(redraw);
    };
    requestAnimationFrame(redraw);

    const startRender = ()=>{
        canvasManager.clear(cfg.bgColor);
        ctx.save();
        ctx.translate(-viewport().x,-viewport().y);
    };

    const endRender = ()=>{
        ctx.restore();
    };

    const nodeRender = ()=>{
        ctx.font="20px Arial";
        g.nodesArray.map((node)=>{
            ctx.fillStyle=cfg.nodeColor.hasOwnProperty(node.prop)?cfg.nodeColor[node.prop]:cfg.nodeColor[""];
            ctx.beginPath();
            ctx.arc(node.x,node.y,node.size,0,2*Math.PI,false);
            ctx.fill();
            ctx.closePath();
        });
    };

    const edgeRender = ()=>{
        ctx.lineWidth=cfg.edgeWidth[""];
        g.edgesArray.map((edge)=>{
            ctx.strokeStyle=cfg.edgeColor.hasOwnProperty(edge.prop)?cfg.edgeColor[edge.prop]:cfg.edgeColor[""];
            ctx.beginPath();
            ctx.moveTo(g.nodesIndex[edge.s].x,g.nodesIndex[edge.s].y);
            ctx.lineTo(g.nodesIndex[edge.t].x,g.nodesIndex[edge.t].y);
            ctx.stroke();
            ctx.closePath();
        });
    };

    const viewport = ()=>{
        const x = cfg.viewport.x-this.viewportOffset.x;
        const y = cfg.viewport.y-this.viewportOffset.y;
        return {x,y};
    };

    this.viewportCoords = (x,y)=>{
        x = x+viewport().x;
        y = y+viewport().y;
        return {x,y};
    };
}