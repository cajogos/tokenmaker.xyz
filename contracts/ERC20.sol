// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// This is the default implementation of a ERC20 contract
// See more: https://ethereum.org/en/developers/docs/standards/tokens/erc-20/

contract ERC20 {
    // Array of the balances for the token per address
    mapping(address => uint256) private _balances;
    // Array of the allowances for the token per address
    mapping(address => mapping(address => uint256)) private _allowances;

    // The total supply for the token
    uint256 private _totalSupply;

    // The name of the token
    string private _name;

    // The symbol of the token
    string private _symbol;

    // This value is replaced on contract compilation (divisble by number of decimals)
    uint256 private _initialSupply = 111222333444555666777;

    // The contract has 18 decimals by default
    uint8 private _decimals = 18;

    constructor(string memory name_, string memory symbol_) {
        _name = name_;
        _symbol = symbol_;

        // The creator of the contract will receive the whole initial supply
        _mint(msg.sender, _initialSupply);
    }

    // Returns the name of the token
    function name() public view virtual returns (string memory) {
        return _name;
    }

    // Returns the symbol of the token
    function symbol() public view virtual returns (string memory) {
        return _symbol;
    }

    // Returns the number of decimals expected
    function decimals() public view virtual returns (uint8) {
        return _decimals;
    }

    // Returns the total supply of the token
    function totalSupply() public view virtual returns (uint256) {
        return _totalSupply;
    }

    // Gets the balance of the token for a given address
    function balanceOf(address account) public view virtual returns (uint256) {
        return _balances[account];
    }

    // Transfers tokens from a sender to a recipient
    function transfer(address recipient, uint256 amount)
        public
        virtual
        returns (bool)
    {
        _transfer(msg.sender, recipient, amount);
        return true;
    }

    // Gets the allowed balance of a token for a given address
    function allowance(address owner, address spender)
        public
        view
        virtual
        returns (uint256)
    {
        return _allowances[owner][spender];
    }

    // Approves the spender to spend the amount on behalf of the owner
    function approve(address spender, uint256 amount)
        public
        virtual
        returns (bool)
    {
        _approve(msg.sender, spender, amount);
        return true;
    }

    // Transfers from the owner by the allowed amount
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) public virtual returns (bool) {
        _transfer(sender, recipient, amount);

        uint256 currentAllowance = _allowances[sender][msg.sender];
        require(
            currentAllowance >= amount,
            "ERC20: transfer amount exceeds allowance"
        );
        unchecked {
            _approve(sender, msg.sender, currentAllowance - amount);
        }

        return true;
    }

    // Private function to handle transfers of the token
    function _transfer(
        address sender,
        address recipient,
        uint256 amount
    ) internal virtual {
        require(sender != address(0), "ERC20: transfer from the zero address");
        require(recipient != address(0), "ERC20: transfer to the zero address");
        uint256 senderBalance = _balances[sender];
        require(
            senderBalance >= amount,
            "ERC20: transfer amount exceeds balance"
        );
        unchecked {
            _balances[sender] = senderBalance - amount;
        }
        _balances[recipient] += amount;

        // Emit the Transfer event
        emit Transfer(sender, recipient, amount);
    }

    // Private function to handle minting of the token (used for inital supply)
    function _mint(address account, uint256 amount) internal virtual {
        require(account != address(0), "ERC20: mint to the zero address");
        _totalSupply += amount;
        _balances[account] += amount;
        emit Transfer(address(0), account, amount);
    }

    // Private function to handle the approval of spending
    function _approve(
        address owner,
        address spender,
        uint256 amount
    ) internal virtual {
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");
        _allowances[owner][spender] = amount;

        // Emit the Approval event
        emit Approval(owner, spender, amount);
    }

    /* Events */

    event Transfer(address indexed from, address indexed to, uint256 value);

    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
}
