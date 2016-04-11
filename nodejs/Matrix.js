"use strict";

/**
 * Swaps 2 rows in matrix
 * @param {[][]}matrix Matrix double array
 * @param {Number} a Row index
 * @param {Number} b Row index
 */
module.exports.swapMatrixRows=(matrix,a,b)=>{
    const _ = matrix[a];
    matrix[a]=matrix[b];
    matrix[b]=_;
};

/**
 * Swaps 2 columns in matrix
 * @param {[][]}matrix Matrix double array
 * @param {Number} a Column index
 * @param {Number} b Column index
 */
module.exports.swapMatrixColumns=(matrix,a,b)=>{
    let _;
    for(let i=0;i<matrix.length;i++){
        _=matrix[i][a];
        matrix[i][a]=matrix[i][b];
        matrix[i][b]=_;
    }
};

/**
 * Applying permutation to matrix
 * @param permutation
 * @param matrix
 */
module.exports.applyPermutation=(permutation,matrix)=>{
    for(let i=0;i<permutation.length;i++){
        module.exports.swapMatrixRows(matrix,i,permutation[i]);
        module.exports.swapMatrixColumns(matrix,i,permutation[i]);
    }
};

/**
 * Checks if two matrix are equal
 * @param {[][]} a Matrix
 * @param {[][]} b Matrix
 * @returns {boolean} a===b
 */
module.exports.equal = (a,b)=>{
    if(a.length!==b.length)
        return false;
    for(let i=0;i<a.length;i++)
        for(let j=0;j<a.length;j++)
            if(a[i][j] ^ b[i][j])
                return false;
    return true;
};