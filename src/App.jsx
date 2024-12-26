import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginScreen from './pages/LoginScreen';

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginScreen />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
