// SPDX-License-Identifier: MIT
pragma solidity ^0.7.5;

contract Fibonacci {
    function fib(uint _n) external pure returns(uint) {
        if (n == 0) {
            return n;
        }

        uint f_1 = 1;
        uint f_2 = 1;

        for(uint i = 2; i < n; i++) {
            uint f = f_1 + f2;
            f_2 = f_1;
            f_1 = f;
        }

        return f_1;
    }
}
