'use strict';

function CanvasManager(canvas){
    const self = this;

    if(typeof canvas === 'string')
        canvas = document.getElementById(canvas);
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");

    const _canvas={};

    const _mouse={};
    _mouse.x=0;
    _mouse.y=0;
    _mouse.over=false;
    _mouse.down=false;
    this.mouse = _mouse;

    this.canvas.onmousedown=(e)=>{
        _mouse.down=true;
        const {x,y}=canvasCoords(e.clientX,e.clientY);
        this.onmousedown({x,y});
    };
    this.canvas.onmouseup=(e)=>{
        _mouse.down=false;
        const {x,y}=canvasCoords(e.clientX,e.clientY);
        this.onmouseup({x,y});
    };

    this.canvas.onmouseover=()=>_mouse.over=true;
    this.canvas.onmouseout=()=>_mouse.over=false;

    this.canvas.onmousemove=(e)=>{
        if(!_mouse.over)return;

        const {x,y}=canvasCoords(e.clientX,e.clientY);
        const dx = (x - _mouse.x);
        const dy = (y - _mouse.y);

        if(_mouse.down)
            self.ondrag({dx,dy,x,y});
        else
            self.onmousemove({x,y});

        _mouse.x=x;
        _mouse.y=y;
    };

    this.canvas.onclick=()=>{
        self.onclick({x:_mouse.x,y:_mouse.y});
    };

    this.canvas.ondblclick=()=>{
        self.ondblclick({x:_mouse.x,y:_mouse.y});
    };

    this.canvas.addEventListener('mousewheel',(e)=>self.onmousewheel(e));

    const canvasCoords = (_x,_y)=>{
        const x = _x-_canvas.box.left;
        const y = _y-_canvas.box.top;
        return {x,y};
    };

    const _onresize = ()=>{
        self.canvas.width=window.innerWidth;
        self.canvas.height=window.innerHeight;
        _canvas.box=self.canvas.getBoundingClientRect();
    };
    window.onresize=_onresize;
    _onresize();


    /**
     * Events
     */
    this.onmousemove=()=>{};
    this.onclick=()=>{};
    this.ondblclick=()=>{};
    this.ondrag=()=>{};
    this.onmousedown=()=>{};
    this.onmouseup=()=>{};
    this.onmousewheel=()=>{};

    /**
     * Methods
     */

    this.clear = (color)=>{
        self.ctx.fillStyle = color;
        self.ctx.fillRect(0,0,self.canvas.width,self.canvas.height);
    };
}