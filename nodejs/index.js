'use strict';
const Permutation = require("./Permutation.js");
const Matrix = require("./Matrix.js");
const a = [[0,1,1,1,0],[1,0,1,1,0],[1,1,0,0,1],[1,1,0,0,0],[0,0,1,0,0]];
const b = [[0,1,0,0,0],[1,0,1,0,1],[0,1,0,1,1],[0,0,1,0,1],[0,1,1,1,0]];

const permutation = Permutation(a.length);

const _time=new Date().getTime();
let count=0;

let p=permutation.next();
while(!p.done){
    count++;
    const _ = p.value;
    for(let i=0;i<_.length;i++){
        Matrix.swapMatrixRows(a,i,_[i]);
        Matrix.swapMatrixColumns(a,i,_[i]);
    }
    if(Matrix.equal(a,b)){
        console.log("Will you show me?",count);
        console.log("Have this: ",_);
        console.log(`Done in ${(new Date().getTime())-_time}ms`);
        return;
    }
    p=permutation.next();
}
console.log("Nope, not happening :^(");
console.log(`Done in ${(new Date().getTime())-_}ms`);