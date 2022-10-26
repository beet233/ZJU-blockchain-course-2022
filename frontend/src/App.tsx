import React from 'react';
import logo from './logo.svg';
import './App.css';
import 'antd/dist/antd.css';
import MainPage from './pages/MainPage/MainPage';
import { Routes, Route, Router, HashRouter } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route index path='/' element={<MainPage />} />
    </Routes>
  );
}

export default App;
