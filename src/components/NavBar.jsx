import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';  // Importa useNavigate

const NavBar = () => {
    const [usuario, setUsuario] = useState({ nombre: '', avatarUrl: '' });
    const [loading, setLoading] = useState(true);  // Controla el estado de carga
    const navigate = useNavigate();  // Usa el hook useNavigate para redirigir

    useEffect(() => {
        const verificarToken = async () => {
            const token = localStorage.getItem('x-token');

            if (!token) {
                setLoading(false);
                return;  // No hay token, no redirige automáticamente
            }

            try {
                const response = await fetch('http://localhost:3000/api/auth', {
                    method: 'GET',
                    headers: {
                        'x-token': token,
                    },
                });

                if (response.status === 401) {
                    localStorage.removeItem('x-token');
                    window.location.href = '/login';  // Redirige solo si el token es inválido
                } else if (response.ok) {
                    const data = await response.json();
                    setUsuario(data);  // Guarda el usuario si el token es válido
                }
            } catch (error) {
                console.error('Error en la verificación:', error);
            } finally {
                setLoading(false);  // Finaliza el estado de carga
            }
        };

        verificarToken();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('x-token');
        window.location.href = '/login';
    };

    // Función para redirigir al hacer clic en "Fitness Track"
    const handleRedirect = () => {
        navigate('/');  // Redirige a la ruta del HomeScreen
    };

    if (loading) {
        return null;  // Evita mostrar el NavBar hasta que termine la verificación
    }

    return (
        <nav className="navbar navbar-expand-lg bg-light">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">
                    Fitness Tracker
                </Link>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <div className="d-flex align-items-center ms-auto">
                        <img
                            src={usuario.avatarUrl}
                            alt="Usuario"
                            className="rounded-circle me-2"
                            width="35"
                            height="35"
                        />
                        <span className="me-3">{usuario.nombre}</span>
                        <button onClick={handleLogout} className="btn btn-outline-danger">
                            Cerrar sesión
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
