import './App.css';
import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LogIn from './LogIn';
import Dashboard from './Dashboard';
import { AuthProvider } from '../contexts/AuthContext';
import PrivateRoute from './PrivateRoute';
import NotFound from './NotFound';

function App() {
  return (
    <div className="App">
        <h1>Tcs Alerts</h1>
        <h2>By: Keaton Freed</h2>
      <AuthProvider>
        <div className='Page'>
          <Router>
            <Routes>
              <Route exact path="/" element={<Navigate to="/dashboard" replace />}></Route>
              <Route path="/dashboard" element={<PrivateRoute reject="/log-in"><Dashboard /></PrivateRoute>}></Route>
              <Route path="/log-in" element={<LogIn></LogIn>}></Route>
              <Route path="*" element={<NotFound></NotFound>}></Route>
            </Routes>
          </Router>
        </div>
      </AuthProvider>
    </div>
  );
}

export default App;
