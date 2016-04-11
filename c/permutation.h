#include <cstdint>

#define _INT uint_fast8_t

using namespace std;

class Permutation{
private:
    int n;
    int i;
    int* idx;
    _INT* permutation;
public:
    Permutation(int n);
    _INT* next();
};
