"use strict";

/**
 * Heap's algorithm
 * Usage:
 * const permutation = Permutation(n);
 * permutation.next();//-> {value:[],done:{boolean}}
 * @param n
 */
function* Permutation(n){
    const permutation = new Array(n);
    const idx = new Array(n);
    let _ = null;

    for(let i=0;i<n;++i) {
        permutation[i] = i;
        idx[i]=0;
    }

    yield permutation;

    for(let i=0;i<n;) {
        if (idx[i] < i) {
            const swap = i % 2 * idx[i];
            _ = permutation[swap];
            permutation[swap] = permutation[i];
            permutation[i] = _;
            yield permutation;

            idx[i]++;
            i = 1;
        }
        else
            idx[i++] = 0;
    }
}

module.exports=Permutation;