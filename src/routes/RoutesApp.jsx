import { Routes, Route } from 'react-router-dom';
import NavBar from '../components/NavBar';
import ProtectedRoutes from './ProtectedRoutes'; // Importamos ProtectedRoutes

import HomeScreen from '../pages/HomeScreen';
import LoginScreen from '../pages/LoginScreen';
import EjercicioScreen from '../pages/EjercicioScreen';
import ErrorScreen from '../pages/ErrorScreen';
import Footer from '../components/Footer';
import RegisterScreen from '../pages/RegisterScreen';

const RoutesApp = ({ login, cambiarLogin }) => {
  return (
    <>
      <NavBar />

      <Routes>
        {/* Rutas protegidas */}
        <Route
          path="/"
          element={
            <ProtectedRoutes login={login}>
              <HomeScreen />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/ejercicio/:id"
          element={
            <ProtectedRoutes login={login}>
              <EjercicioScreen />
            </ProtectedRoutes>
          }
        />

        {/* Rutas no protegidas */}
        <Route path="/login" element={<LoginScreen cambiarLogin={cambiarLogin} />} />
        <Route path="/register" element={<RegisterScreen />} /> {/* Ruta sin protección */}

        {/* Ruta para errores */}
        <Route path="*" element={<ErrorScreen />} />
      </Routes>

      <Footer />
    </>
  );
};

export default RoutesApp;
