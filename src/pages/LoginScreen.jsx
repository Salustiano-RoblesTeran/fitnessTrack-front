import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginScreen = () => {
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);  // Estado de carga
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);  // Iniciar el estado de carga

        try {
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ correo, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error en la autenticación');
            }

            const { token } = data;
            localStorage.setItem('x-token', token);
            console.log(token);

            navigate('/');  // Redirigir a la pantalla principal
        } catch (error) {
            setError('Credenciales incorrectas. Intenta de nuevo.');
        } finally {
            setLoading(false);  // Termina el estado de carga
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
            <div className="card p-4" style={{ width: '100%', maxWidth: '400px' }}>
                <h3 className="text-center mb-4">Iniciar Sesión</h3>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
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
                    <button
                        type="submit"
                        className="btn btn-primary w-100"
                        disabled={loading}  // Desactivar botón mientras carga
                    >
                        {loading ? (
                            <span className="spinner-border spinner-border-sm"></span>
                        ) : (
                            'Ingresar'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginScreen;
