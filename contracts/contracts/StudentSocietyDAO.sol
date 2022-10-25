// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;

// Uncomment the line to use openzeppelin/ERC20
// You can use this dependency directly because it has been installed already
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "./BeetCoin.sol";

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract StudentSocietyDAO {

    // use a event if you want
    event ProposalInitiated(uint32 proposalIndex);

    struct Student {
      bool hasInit;
    }

    struct Proposal {
        uint32 index;      // index of this proposal
        address proposer;  // who make this proposal
        uint256 startTime; // proposal start time
        uint256 endTime;  // proposal duration
        string topic;       // proposal name
        string text;        // proposal text
        uint256 agree;
        uint256 disagree;
        bool finished;
    }

    BeetCoin studentERC20;
    mapping(address => Student) students;
    uint32 proposalIndex = 0;
    mapping(uint32 => Proposal) proposals; // A map from proposal index to proposal

    constructor() {
        // maybe you need a constructor
        studentERC20 = new BeetCoin();
    }

    function whoAmI() pure external returns(string memory) {
        return "BeetCoin!";
    }

    function getTotalSupply() view external returns(uint256 totalSupply) {
        return studentERC20.totalSupply();
    }

    function getBalanceOf(address account) view external returns(uint256 balance) {
        return studentERC20.balanceOf(account);
    }

    function getBankBalance() view external returns(uint256) {
        return studentERC20.balanceOf(address(this));
    }

    function getInitBalance() external returns(bool ok) {
        if (!students[msg.sender].hasInit) {
            studentERC20.transfer(msg.sender, 100);
            studentERC20.allow(msg.sender, 100);
            students[msg.sender].hasInit = true;
            return true;
        } else {
            return false;
        }
    }

    function transferToBank(uint256 amount) external {
        studentERC20.transferFrom(msg.sender, address(this), amount);
    }

    function raiseNewProposal(string memory topic, string memory text, uint256 startTime, uint256 endTime) external {
        // 50 BeetCoin to raise a proposal
        studentERC20.transferFrom(msg.sender, address(this), 50);
        proposals[proposalIndex] = Proposal(proposalIndex, msg.sender, startTime, endTime, topic, text, 0, 0, false);
        proposalIndex += 1;
    }

    function agree(uint32 index, uint256 amount) external returns(bool ok) {
        if (block.timestamp > proposals[index].startTime && block.timestamp < proposals[index].endTime) {
            studentERC20.transferFrom(msg.sender, address(this), amount);
            proposals[index].agree += amount;
            return true;
        } else {
            return false;
        }
    }

    function disagree(uint32 index, uint256 amount) external returns(bool ok) {
        if (block.timestamp > proposals[index].startTime && block.timestamp < proposals[index].endTime) {
            studentERC20.transferFrom(msg.sender, address(this), amount);
            proposals[index].disagree += amount;
            return true;
        } else {
            return false;
        }
    }

    function finishEndedProposal(uint32 index) external returns(bool ok) {
        if (block.timestamp > proposals[index].endTime) {
            proposals[index].finished = true;
            if (proposals[index].agree > proposals[index].disagree) {
                // 奖励发起人 100 BeetCoin
                studentERC20.transfer(proposals[index].proposer, 100);
                studentERC20.allow(proposals[index].proposer, 100);
            }
            return true;
        } else {
            return false;
        }
    }

    // 这里面的 timestamp 似乎是写在 block 里的最新时间，而只有非 pure 和非 view 操作可以更新 block 内的时间
    function getTime() external returns(uint256) {
        return block.timestamp;
    }

    function getAllProposals() view external returns(Proposal[] memory) {
        Proposal[] memory result = new Proposal[](proposalIndex);
        for (uint32 i=0; i<proposalIndex; i++) {
            result[i] = proposals[i];
        }
        return result;
    }
}
