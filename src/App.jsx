import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginScreen from './pages/LoginScreen';
import HomeScreen from './pages/HomeScreen';
import ErrorScreen from './pages/ErrorScreen';
import EjercicioScreen from './pages/EjercicioScreen';

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomeScreen/>}/>
          <Route path="/login" element={<LoginScreen />} />
          <Route path='/ejercicio/:id' element={<EjercicioScreen/>} />
          <Route path="*" element={<ErrorScreen/>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
