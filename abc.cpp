#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<long long> coins(n);
    for (int i = 0; i < n; i++) {
        cin >> coins[i];
    }

    sort(coins.begin(), coins.end());

    long long current_sum = 0;
    for (int i = 0; i < n; i++) {
        if (coins[i] > current_sum + 1) {
            cout << current_sum + 1 << endl;
            return 0;
        }
        current_sum += coins[i];
    }

    cout << current_sum + 1 << endl;
    return 0;
}