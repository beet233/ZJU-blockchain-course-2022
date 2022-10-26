import React, { useState, useEffect } from "react";
import { Layout, Button, Card, Modal, Input } from "antd";
import "./MainPage.css";
import PicBeet from "../../pics/甜菜.png";
import { Router, Route, Link } from 'react-router-dom'; 

const { Header, Footer, Sider, Content } = Layout;

function MainPage() {
  const [proposalLoading, setProposalLoading] = useState(true);
  return (
    <Layout>
      <Header className="header"><img src={PicBeet} className="pic"></img></Header>
      <Layout>
        <Sider className="sider" width={300 + "px"}>
          <img src={PicBeet} className="picSider"></img>
          <br />
          <br />
          我是<strong>甜菜/Beet</strong>
          <br />
          这是 <strong>BeetCoin</strong> 唯一交易网站
          <br />
          Contact me at
          <br />
          <a>beet@zju.edu.cn</a>
          <br />
        </Sider>
        <Content className="content">
          {proposalLoading ? "loading..." : "proposals"}
        </Content>
      </Layout>
      <Footer className="footer">
        <strong>Powered by</strong>：React web3.js Solidity
      </Footer>
      
      
    </Layout>
  );
}

export default MainPage;
