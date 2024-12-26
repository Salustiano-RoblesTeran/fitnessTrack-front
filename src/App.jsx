import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginScreen from './pages/LoginScreen';
import HomeScreen from './pages/HomeScreen';
import ErrorScreen from './pages/ErrorScreen';

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomeScreen/>}/>
          <Route path="/login" element={<LoginScreen />} />
          <Route path="*" element={<ErrorScreen/>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
