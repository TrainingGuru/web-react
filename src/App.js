import './App.css';
import React, { Component } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import TrainerHome from './components/TrainerHome';
import TrainerCatchUp from './components/TrainerCatchUp';
import TrainerManageClients from './components/TrainerManageClients';
import TrainerProfile from './components/TrainerProfile';
import TrainerLogin from './components/TrainerLogin';
import TrainerRegister from './components/TrainerRegister';

export default class App extends Component 
{
  render()
  {
    return (
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<TrainerHome />} />
          <Route exact path="/CatchUp" element={<TrainerCatchUp />} />
          <Route exact path="/Manage" element={<TrainerManageClients />} />
          <Route exact path="/Profile" element={<TrainerProfile />} />
          <Route exact path="/Login" element={<TrainerLogin />} />
          <Route exact path="/Register" element={<TrainerRegister />} />
        </Routes>
      </BrowserRouter>
    )
  }
}
