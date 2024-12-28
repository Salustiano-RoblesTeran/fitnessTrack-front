import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const RegisterScreen = () => {
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [repetirPassword, setRepetirPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);  // Estado de carga
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);  // Iniciar el estado de carga

        if (password !== repetirPassword) {
            setError('Las contraseñas no coinciden');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nombre, correo, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error en el registro');
            }

            navigate('/login');  // Redirigir al login después de registro exitoso
        } catch (error) {
            setError('Hubo un error al registrar el usuario. Intenta de nuevo.');
        } finally {
            setLoading(false);  // Termina el estado de carga
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
            <div className="card p-4" style={{ width: '100%', maxWidth: '400px' }}>
                <h3 className="text-center mb-4">Registro</h3>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="nombre" className="form-label">Nombre</label>
                        <input
                            type="text"
                            className="form-control"
                            id="nombre"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                            disabled={loading}  // Desactivar input mientras carga
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="correo" className="form-label">Correo Electrónico</label>
                        <input
                            type="email"
                            className="form-control"
                            id="correo"
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                            required
                            disabled={loading}  // Desactivar input mientras carga
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Contraseña</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}  // Desactivar input mientras carga
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="repetirPassword" className="form-label">Repetir Contraseña</label>
                        <input
                            type="password"
                            className="form-control"
                            id="repetirPassword"
                            value={repetirPassword}
                            onChange={(e) => setRepetirPassword(e.target.value)}
                            required
                            disabled={loading}  // Desactivar input mientras carga
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary w-100"
                        disabled={loading}  // Desactivar botón mientras carga
                    >
                        {loading ? (
                            <span className="spinner-border spinner-border-sm"></span>
                        ) : (
                            'Registrarse'
                        )}
                    </button>
                </form>
                <div className="text-center mt-3">
                    <p>¿Ya tienes una cuenta?</p>
                    <Link to="/login">Inicia sesión</Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterScreen;
