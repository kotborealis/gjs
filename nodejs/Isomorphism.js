"use strict";
const Permutation = require("./Permutation.js");
const Matrix = require("./Matrix.js");
module.exports = function(a,b,timeout,log){
    const permutation = Permutation(a.length);
    const _time=new Date().getTime();
    let count=0;
    let p=permutation.next();
    while(!p.done){
        if(timeout>0 && (new Date().getTime())-_time>timeout){
            if(log===true) {
                console.log(`Iterated through ${count} permutations.`);
                console.log(`Iteration timed out.`);
                console.log(`Done in ${(new Date().getTime()) - _time}ms`);
            }
            return {permutation:[],isomorphic:null};
        }
        count++;
        Matrix.applyPermutation(p.value,a);
        if(Matrix.equal(a,b)){
            if(log===true) {
                console.log(`Iterated through ${count} permutations.`);
                console.log(`Found isomorphic permutation: ${p.value}`);
                console.log(`Done in ${(new Date().getTime()) - _time}ms`);
            }
            return {permutation:_,isomorphic:true};
        }
        p=permutation.next();
    }
    if(log===true) {
        console.log(`Iterated through ${count} permutations.`);
        console.log(`Not isomorphic graphs.`);
        console.log(`Done in ${(new Date().getTime()) - _time}ms`);
    }
    return {permutation:[],isomorphic:false};
};