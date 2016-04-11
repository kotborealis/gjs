"use strict";

module.exports.swapMatrixRows=(matrix,a,b)=>{
    const _ = matrix[a];
    matrix[a]=matrix[b];
    matrix[b]=_;
};

module.exports.swapMatrixColumns=(matrix,a,b)=>{
    let _;
    for(let i=0;i<matrix.length;i++){
        if(matrix[i][a]^matrix[i][a]){
            _=matrix[i][a];
            matrix[i][a]=matrix[i][b];
            matrix[i][b]=_;
        }
    }
};

module.exports.equal = (a,b)=>{
    if(a.length!==b.length)
        return false;
    for(let i=0;i<a.length;i++)
        for(let j=0;j<a.length;j++)
            if(a[i][j] ^ b[i][j])
                return false;
    return true;
};
