#include <iostream>
#include <cstdlib>
#include <time.h>
#include <cstdint>
#include "permutation.h"

#define _INT uint_fast8_t

using namespace std;

int main(int argc, char** argv){
    int n = atoi(argv[1]);
    Permutation* p = new Permutation(n);
    clock_t tStart = clock();
    while(p->next()!=NULL);
    double tEnd = (double)(clock() - tStart)/CLOCKS_PER_SEC;
    std::cout<<tEnd<<"s\n";
};
