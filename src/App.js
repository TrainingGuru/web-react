import './App.css';
import React, { Component } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';

import TrainerHome from './components/TrainerHome';
import TrainerCatchUp from './components/TrainerCatchUp';
import TrainerManageClients from './components/TrainerManageClients';
import TrainerProfile from './components/TrainerProfile';
import TrainerLogin from './components/TrainerLogin';
import TrainerRegister from './components/TrainerRegister';
import PrivateRoute from './components/PrivateRoute';
import LoginRoute from './components/LoginRoute';
import LogoutRoute from './components/LogoutRoute';

export default class App extends Component 
{
  render()
  {
    return (
      <HashRouter>
        <Routes>
          <Route exact path="/Login" element={
            <LoginRoute>
              <TrainerLogin />
            </LoginRoute>
          } />
          <Route exact path="/Register" element={<TrainerRegister />} />

          <Route exact path="/" element={
            <PrivateRoute>
              <TrainerHome />
            </PrivateRoute>
          } />
          <Route exact path="/CatchUp" element={
            <PrivateRoute>
              <TrainerCatchUp />
            </PrivateRoute>
          } />
          <Route exact path="/Manage" element={
            <PrivateRoute>
              <TrainerManageClients />
            </PrivateRoute>
          } />
          <Route exact path="/Profile" element={
            <PrivateRoute>
              <TrainerProfile />
            </PrivateRoute>
          } />


          <Route exact path="/Logout" element={
            <LogoutRoute>
              <TrainerLogin />
            </LogoutRoute>
          } />
        </Routes>
      </HashRouter>
    )
  }
}
