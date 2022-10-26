# ZJU-blockchain-course-2022

[toc]

> 第二次作业要求（可以删除）：
> 
> 去中心化学生社团组织治理应用 
> 
> - 每个学生初始可以拥有或领取一些通证积分（ERC20）。 
> - 每个学生可以在应用中可以： 
>    1. 使用一定数量通证积分，发起关于该社团进行活动或制定规则的提案（Proposal）。 
>    2. 提案发起后一定支出时间内，使用一定数量通证积分可以对提案进行投票（赞成或反对，限制投票次数），投票行为被记录到区块链上。 
>    3. 提案投票时间截止后，赞成数大于反对数的提案通过，提案发起者作为贡献者可以领取一定的积分奖励。 
> 
> - (Bonus）发起提案并通过3次的学生，可以领取社团颁发的纪念品（ERC721）

**以下内容为作业仓库的README.md中需要描述的内容。请根据自己的需要进行修改并提交。**

作业提交方式为：提交视频文件和仓库的连接到指定邮箱。

## 如何运行

1. 在本地启动ganache应用。

2. 在 `./contracts` 中安装需要的依赖，运行如下的命令：
    ```bash
    npm install
    ```

3. 在 `./contracts` 中编译合约，可以直接在 remix 在线 IDE 中编译:

    

4. 部署也可以直接在 remix 中部署：

    

5. 在 metamask 中连接本地 ganache 链，并随便导入几个有一些初始 ETH 的账户：

    

6. 在 `./frontend` 中启动前端程序，运行如下的命令：
    ```bash
    npm start
    ```

## 功能实现分析

简单描述：项目完成了要求的哪些功能？每个功能具体是如何实现的？

完成了除 bonus 外的所有功能。

### 获取初始货币

#### 合约

```solidity
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
```

#### 前端



### 发起投票

#### 合约

```solidity
	function raiseNewProposal(string memory topic, string memory text, uint256 startTime, uint256 endTime) external {
        // 50 BeetCoin to raise a proposal
        studentERC20.transferFrom(msg.sender, address(this), 50);
        proposals[proposalIndex] = Proposal(proposalIndex, msg.sender, startTime, endTime, topic, text, 0, 0, false);
        proposalIndex += 1;
    }
```

#### 前端



### 赞成、反对、结束投票

#### 合约

```solidity
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
```

#### 前端



## 项目运行截图

放一些项目运行截图。

项目运行成功的关键页面和流程截图。主要包括操作流程以及和区块链交互的截图。

### 领钱



### 发起投票



### 支持投票



## 参考内容

课程的参考Demo见：[DEMOs](https://github.com/LBruyne/blockchain-course-demos)。

如果有其它参考的内容，也请在这里陈列。
