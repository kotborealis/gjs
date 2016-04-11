#include <iostream>
#include <cstdlib>
#include <time.h>
#include <cstdint>

#define _INT uint_fast8_t

using namespace std;


int main(int argc, char** argv){
    int n = atoi(argv[1]);
    _INT permutation[n];
    int idx[n];

    for(int i=0;i<n;i++){
        permutation[i]=i;
        idx[i]=0;
    }

    clock_t tStart = clock();
    for (int i=1;i<n;){
        if(idx[i]<i){
            int swap = i%2*idx[i];
            int tmp = permutation[swap];
            permutation[swap] = permutation[i];
            permutation[i] = tmp;
            idx[i]++;
            i = 1;
        }
        else
            idx[i++] = 0;
    }
    double tEnd = (double)(clock() - tStart)/CLOCKS_PER_SEC;
    std::cout<<tEnd<<"s\n";
};
