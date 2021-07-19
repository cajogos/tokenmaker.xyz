// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Altered from: https://github.com/OpenZeppelin/openzeppelin-contracts/blob/7e41bf2259950c33e55604015875b7780b6a2e63/contracts/token/ERC20/ERC20.sol

contract ERC20 {
    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;
    uint256 private _totalSupply;
    string private _name;
    string private _symbol;

    // This value is replaced on contract compilation
    uint256 private _initialSupply = 111222333444555666777;

    uint8 private _decimals = 18;

    constructor(string memory name_, string memory symbol_) {
        _name = name_;
        _symbol = symbol_;

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
