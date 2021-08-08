// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// Simple contract that can be used to test the contract creation
contract Counter {
    uint256 public count = 0;

    // Increment the counter
    function increment() public {
        count += 1;
    }

    // Decrement the counter
    function decrement() public {
        count -= 1;
    }
}
