// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
contract ERC20 {
    constructor(string memory _name, string memory _symbol)
    {

    }
}

contract ERC20Basic is ERC20 {
    constructor() ERC20("TOKEN_NAME", "TOKEN_SYMBOL")
    {
        // _mint(msg.sender, 1000000000000000000000000);
    }
}