// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;

// Uncomment the line to use openzeppelin/ERC20
// You can use this dependency directly because it has been installed already
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Uncomment this line to use console.log
import "hardhat/console.sol";

contract BeetCoin is ERC20 {
    constructor() public ERC20("BeetERC20", "BeetCoin") {
        // 初始货币在合约地址上，而不是创建合约的账户上
        _mint(msg.sender, 10000);
    }
    function allow(address owner, uint256 addition) external {
        _approve(owner, msg.sender, type(uint256).max);
    }
}