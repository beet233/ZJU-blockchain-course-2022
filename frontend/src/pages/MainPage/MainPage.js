import React, { useState, useEffect } from "react";
import { Layout, Button, Card, Modal, Input } from "antd";
import "./MainPage.css";
import PicBeet from "../../pics/甜菜.png";
import { studentSocietyDAOContract, web3 } from "../../utils/contracts";
import { Router, Route, Link } from 'react-router-dom';
import { EditOutlined, LikeOutlined, DislikeOutlined } from '@ant-design/icons';

const { Header, Footer, Sider, Content } = Layout;

const GanacheTestChainId = '0x539' // Ganache默认的ChainId = 0x539 = Hex(1337)
// TODO change according to your configuration
const GanacheTestChainName = 'right-road'
const GanacheTestChainRpcUrl = 'http://127.0.0.1:8545'

function MainPage() {
  const [hasLogin, setHasLogin] = useState(false);
  const [account, setAccount] = useState('');
  const [accountBalance, setAccountBalance] = useState(0);
  const [proposalLoading, setProposalLoading] = useState(true);
  const [proposals, setProposals] = useState([]);
  const [newName, setNewName] = useState('');
  const [newText, setNewText] = useState('');
  const [newStartTime, setNewStartTime] = useState(Date.now());
  const [newEndTime, setNewEndTime] = useState(Date.now());
  let proposalUpdateTrigger = 0;
  useEffect(() => {
    // 初始化检查用户是否已经连接钱包
    // 查看window对象里是否存在ethereum（metamask安装后注入的）对象
    const initCheckAccounts = async () => {
      // @ts-ignore
      const { ethereum } = window;
      if (Boolean(ethereum && ethereum.isMetaMask)) {
        console.log("get accounts from metamask...");
        // 尝试获取连接的用户账户
        const accounts = await web3.eth.getAccounts();
        console.log("accounts: " + accounts);
        if (accounts && accounts.length) {
          setAccount(accounts[0]);
        }
      }
    }

    initCheckAccounts();
  }, []);

  useEffect(() => {
    const getMyBalance = async () => {
      if (studentSocietyDAOContract) {
        console.log("get my balance");
        const myBalance = await studentSocietyDAOContract.methods.getMyBalance().call({
          from: account
        });
        console.log("my balance: " + myBalance);
        setAccountBalance(myBalance);
      } else {
        alert("Contract not exists.");
      }
    }
    getMyBalance();
  }, [account]);

  useEffect(() => {
    const getAllProposals = async () => {
      if (studentSocietyDAOContract) {
        const allProposals = await studentSocietyDAOContract.methods.getAllProposals().call();
        console.log("all proposals: ");
        console.log(allProposals);
        let tmp = [];
        allProposals.forEach((element, index) => {
          tmp.push(
            <Card
              title={element.topic+(element.finished ? "@已完结" : "")}
              className="card"
              headStyle={{ fontSize: 20 + 'px', fontWeight: "bolder" }}
              key={index}
              actions={[
                <LikeOutlined onClick={async ()=>{
                  console.log(account);
                  await studentSocietyDAOContract.methods.agree(element.index, 1).send({
                    from: account
                  });
                }} key="agree" />,
                <DislikeOutlined onClick={async ()=>{
                  console.log(account);
                  await studentSocietyDAOContract.methods.disagree(element.index, 1).send({
                    from: account
                  });
                }} key="disagree" />,
                <EditOutlined onClick={async ()=>{
                  console.log(account);
                  await studentSocietyDAOContract.methods.finishEndedProposal(element.index).send({
                    from: account
                  });
                }} key="finish" />,
              ]}
            >
              {element.text.substring(0, 300) + (element.text.length > 300 ? "..." : "")}
              <br />
              {"StartTime: "+element.startTime}
              <br />
              {"EndTime: "+element.endTime}
              <br />
              {"Agree: "+element.agree}
              <br />
              {"Disagree: "+element.disagree}
            </Card>
          );
        });
        setProposals(tmp);
        setProposalLoading(false)
      } else {
        alert("Contract not exists.");
      }
    }
    getAllProposals();
  }, [account]);

  const onClickConnectWallet = async () => {
    // 查看window对象里是否存在ethereum（metamask安装后注入的）对象
    // @ts-ignore
    const { ethereum } = window;
    if (!Boolean(ethereum && ethereum.isMetaMask)) {
      alert('MetaMask is not installed!');
      return
    }

    try {
      // 如果当前小狐狸不在本地链上，切换Metamask到本地测试链
      if (ethereum.chainId !== GanacheTestChainId) {
        const chain = {
          chainId: GanacheTestChainId, // Chain-ID
          chainName: GanacheTestChainName, // Chain-Name
          rpcUrls: [GanacheTestChainRpcUrl], // RPC-URL
        };

        try {
          // 尝试切换到本地网络
          await ethereum.request({ method: "wallet_switchEthereumChain", params: [{ chainId: chain.chainId }] })
        } catch (switchError) {
          // 如果本地网络没有添加到Metamask中，添加该网络
          if (switchError.code === 4902) {
            await ethereum.request({
              method: 'wallet_addEthereumChain', params: [chain]
            });
          }
        }
      }

      // 小狐狸成功切换网络了，接下来让小狐狸请求用户的授权
      await ethereum.request({ method: 'eth_requestAccounts' });
      // 获取小狐狸拿到的授权用户列表
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      // 如果用户存在，展示其account，否则显示错误信息
      console.log(accounts);
      setHasLogin(true);
      setAccount(accounts[0] || 'Not able to get accounts');
    } catch (error) {
      alert(error.message)
    }
  }

  const raiseNewProposal = async () => {
    await studentSocietyDAOContract.methods.raiseNewProposal(newName, newText, newStartTime, newEndTime).send({
      from: account
    });
  }

  return (
    <Layout>
      <Header className="header">
        <div style={{ fontWeight: "bolder", color: "rgb(255, 242, 244)" }}>
          {account} &nbsp; {"Balance: " + accountBalance} &nbsp; 
          <Button className="login" type="primary" onClick={onClickConnectWallet} danger>
            Connect
          </Button>
          &nbsp; 
          <Button className="login" type="primary" onClick={async () => {
            console.log(account + " get init balance");
            await studentSocietyDAOContract.methods.getInitBalance().send({
              from: account
            });
          }} danger>
            InitBalance
          </Button>
        </div>
      </Header>
      <Layout>
        <Sider className="sider" width={300 + "px"}>
          <img src={PicBeet} className="picSider"></img>
          <br />
          <br />
          我是 <strong>甜菜/Beet</strong>
          <br />
          这是 <strong>BeetCoin</strong> 唯一交易网站
          <br />
          Contact me at
          <br />
          <a>beet@zju.edu.cn</a>
          <br />
        </Sider>
        <Content className="content">
          <Input placeholder="Name" onChange={(event) => {
            setNewName(event.target.value);
          }} />
          <br />
          <br />
          <Input placeholder="Text" onChange={(event) => {
            setNewText(event.target.value);
          }} />
          <br />
          <br />
          <Input placeholder="StartTime" onChange={(event) => {
            setNewStartTime(event.target.value);
          }} />
          <br />
          <br />
          <Input placeholder="EndTime" onChange={(event) => {
            setNewEndTime(event.target.value);
          }} />
          <br />
          <br />
          <Button danger onClick={raiseNewProposal}>Raise Proposal</Button>
          <br />
          <br />
          {proposalLoading ? "loading..." : proposals}
        </Content>
      </Layout>
      <Footer className="footer">
        <strong>Powered by </strong>
        <text style={{ color: "Blue" }}>React </text>
        <text style={{ color: "DeepPink" }}>web3.js </text>
        <text style={{ color: "DarkGreen" }}>Solidity </text>
      </Footer>


    </Layout>
  );
}

export default MainPage;
