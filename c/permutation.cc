#include "permutation.h"
#include <iostream>
#include <time.h>
#include <cstdlib>

using namespace std;

Permutation::Permutation(int n_){
    i=1;
    n=n_;
    idx=(int*)malloc(sizeof idx * n);
    permutation=(_INT*)malloc(sizeof permutation * n);
    for(int i=0;i<n;i++){
        permutation[i]=i;
        idx[i]=0;
    }
}

_INT* Permutation::next(){
    for (;i<n;){
        if(idx[i]<i){
            int swap = i%2*idx[i];
            int tmp = permutation[swap];
            permutation[swap] = permutation[i];
            permutation[i] = tmp;
            idx[i]++;
            i = 1;
            return permutation;
        }
        else
            idx[i++] = 0;
    }
    return NULL;
}
