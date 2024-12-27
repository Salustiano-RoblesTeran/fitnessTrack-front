import { Routes, Route } from "react-router-dom";
import NavBar from "../components/NavBar";
import ProtectedRoutes from "./ProtectedRoutes";  // Importamos ProtectedRoutes

import HomeScreen from "../pages/HomeScreen";
import LoginScreen from "../pages/LoginScreen";
import EjercicioScreen from "../pages/EjercicioScreen";
import ErrorScreen from "../pages/ErrorScreen";

const RoutesApp = () => {
  return (
    <>
      <NavBar />

      <Routes>
        <Route path="/" element={<ProtectedRoutes><HomeScreen /></ProtectedRoutes>} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/ejercicio/:id" element={<ProtectedRoutes><EjercicioScreen /></ProtectedRoutes>} />
        <Route path="*" element={<ErrorScreen />} />
      </Routes>
    </>
  );
};

export default RoutesApp;
