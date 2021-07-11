// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Counter {

    // Public variable of type unsigned int to keep the number of counts
    uint256 public count = 0;

    // Function that increments the counter
    function increment() public {
        count += 1;
    }

    // Function that decrements the counter
    function decrement() public {
        count -= 1;
    }

    // Not necessary* Function to get the count
    function getCount() public view returns (uint256) {
        return count;
    }
}