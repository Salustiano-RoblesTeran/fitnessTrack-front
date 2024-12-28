import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RoutesApp from './routes/RoutesApp';
import LoginScreen from './pages/LoginScreen';
import RegisterScreen from './pages/RegisterScreen'; // Importamos la pantalla de registro
import ProtectedRoutes from './routes/ProtectedRoutes';

function App() {
  const [login, setLogin] = useState(false);

  const cambiarLogin = () => {
    setLogin(!login); // Cambia el estado de login
  };

  return (
    <Router>
      <Routes>
        {/* Rutas protegidas */}
        <Route
          path="/*"
          element={
            <ProtectedRoutes login={login}>
              <RoutesApp login={login} cambiarLogin={cambiarLogin} />
            </ProtectedRoutes>
          }
        />

        {/* Ruta para login */}
        <Route path="/login" element={<LoginScreen cambiarLogin={cambiarLogin} />} />

        {/* Ruta para registro */}
        <Route path="/register" element={<RegisterScreen />} /> {/* Ruta para registro */}

      </Routes>
    </Router>
  );
}

export default App;
