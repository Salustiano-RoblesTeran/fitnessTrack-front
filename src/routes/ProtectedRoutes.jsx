import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoutes = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);  // Estado para manejar la autenticación

    useEffect(() => {
        const checkAuthentication = async () => {
            const token = localStorage.getItem('x-token');
            if (!token) {
                setIsAuthenticated(false);  // Si no hay token, no está autenticado
                return;
            }

            try {
                const response = await fetch('https://fitnesstrack-back.onrender.com/api/auth', {
                    method: 'GET',
                    headers: {
                        'x-token': token,
                    },
                });

                if (response.ok) {
                    setIsAuthenticated(true);  // Si el token es válido, el usuario está autenticado
                } else {
                    setIsAuthenticated(false);  // Si no es válido, redirigir al login
                }
            } catch (error) {
                console.error('Error al verificar el token:', error);
                setIsAuthenticated(false);  // Si hay error, también se redirige al login
            }
        };

        checkAuthentication();
    }, []);

    if (isAuthenticated === null) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        );  // Spinner de Bootstrap mientras se valida el token
    }

    return isAuthenticated ? children : <Navigate to="/login" />;  // Si está autenticado, muestra el contenido, sino redirige
};

export default ProtectedRoutes;
