import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';
import ProtectedRoutes from './routes/ProtectedRoutes';
import RoutesApp from './routes/RoutesApp';
import LoginScreen from './pages/LoginScreen';

function App() {

  const [login, setLogin] = useState(false)

  const cambiarLogin = () => {
    setLogin(!login)
  }

  return (
    <>
    <BrowserRouter>
        <Routes>
          <Route path='/*' element={
            <ProtectedRoutes login = {login}>
              <RoutesApp cambiarLogin = {cambiarLogin}/>
            </ProtectedRoutes>
          }/>
          <Route path="/login" element={<LoginScreen cambiarLogin= {cambiarLogin}/>} />
        </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
