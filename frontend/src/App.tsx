import React from 'react';
import logo from './logo.svg';
import './App.css';
import 'antd/dist/antd.css';
import MainPage from './pages/MainPage/MainPage';
import { Routes, Route, Router, HashRouter } from 'react-router-dom';
import ProposalPage from './pages/ProposalPage/ProposalPage';
import AddPage from './pages/AddPage/AddPage';

function App() {
  return (
    <Routes>
      <Route index path='/' element={<MainPage />} />
      <Route path='/proposal/:pid' element={<ProposalPage />} />
      <Route path='/add' element={<AddPage />} />
    </Routes>
  );
}

export default App;
