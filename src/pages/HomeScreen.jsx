import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import NuevoEjercicioModal from '../components/modals/NuevoEjercicioModal';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import 'bootstrap/dist/css/bootstrap.min.css';

const HomeScreen = () => {
    const [diaSeleccionado, setDiaSeleccionado] = useState('');
    const [ejercicios, setEjercicios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    const [actividad, setActividad] = useState('');
    const [distancia, setDistancia] = useState(0);
    const [distancias, setDistancias] = useState([]);

    const days = [
        { name: "Lun", fullName: "Lunes", key: "Lunes" },
        { name: "Mar", fullName: "Martes", key: "Martes" },
        { name: "Mié", fullName: "Miércoles", key: "Miercoles" },
        { name: "Jue", fullName: "Jueves", key: "Jueves" },
        { name: "Vie", fullName: "Viernes", key: "Viernes" },
        { name: "Sáb", fullName: "Sábado", key: "Sabado" },
        { name: "Dom", fullName: "Domingo", key: "Domingo" }
    ];

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.pathname === '/') {
            setDiaSeleccionado('');
            setEjercicios([]);
        }
    }, [location]);

    useEffect(() => {
        if (diaSeleccionado) {
            const diaKey = days.find(d => d.name === diaSeleccionado)?.key;
            if (diaKey) obtenerEjercicios(diaKey);
        }
    }, [diaSeleccionado]);

    const obtenerEjercicios = async (diaKey) => {
        const token = localStorage.getItem('x-token');

        if (!token) {
            console.error('No hay token disponible');
            window.location.href = '/login';
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`http://localhost:3000/api/ejercicio?dia=${diaKey}`, {
                method: 'GET',
                headers: {
                    'x-token': token
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.msg || 'Error al obtener ejercicios');
            }

            setEjercicios(data);
        } catch (error) {
            console.error('Error al obtener ejercicios:', error.message);
            setEjercicios([]);
        } finally {
            setLoading(false);
        }
    };

    const agregarEjercicio = (ejercicio) => {
        setEjercicios([...ejercicios, ejercicio]);
    };

    const handleEjercicioClick = (ejercicioId) => {
        navigate(`/ejercicio/${ejercicioId}`);
    };

    const agregarDistancia = () => {
        if (distancia > 0) {
            setDistancias([...distancias, distancia]);
            setDistancia(0);
        }
    };

    const data = {
        labels: distancias.map((_, index) => `Sesión ${index + 1}`),
        datasets: [
            {
                label: actividad,
                data: distancias,
                backgroundColor: 'rgba(75, 192, 192, 0.6)'
            }
        ]
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Rutina Semanal</h2>

            <div className="d-flex overflow-auto mb-4">
                {days.map((dia, index) => (
                    <button
                        key={index}
                        className={`btn me-2 ${diaSeleccionado === dia.name ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setDiaSeleccionado(dia.name)}
                    >
                        {dia.name}
                    </button>
                ))}
            </div>

            <div className="text-center mb-4">
                <h4>{days.find(dia => dia.name === diaSeleccionado)?.fullName || ''}</h4>
            </div>

            {loading ? (
                <p className="text-center">Cargando ejercicios...</p>
            ) : diaSeleccionado && ejercicios.length > 0 ? (
                <ul className="list-group">
                    {ejercicios.map((ejercicio) => (
                        <li 
                            key={ejercicio._id} 
                            className="list-group-item d-flex justify-content-between align-items-center"
                            onClick={() => handleEjercicioClick(ejercicio._id)}
                        >
                            <div>
                                <span className="fw-bold">{ejercicio.nombreEjercicio}</span>
                                <p className="text-muted mb-0">{ejercicio.grupoMusculares}</p>
                            </div>
                            <span className="text-muted">
                                {ejercicio.series} x {ejercicio.repeticiones} - {ejercicio.historialPesos[ejercicio.historialPesos.length - 1]?.peso} kg
                            </span>
                        </li>
                    ))}
                </ul>
            ) : diaSeleccionado && ejercicios.length === 0 ? (
                <p className="text-center">No hay ejercicios para este día.</p>
            ) : (
                <p className="text-center">Selecciona un día para ver los ejercicios.</p>
            )}

            {!diaSeleccionado && (
                <div className="text-center mt-5">
                    <h3>Selecciona una actividad:</h3>

                    <ul className="nav nav-tabs justify-content-center mb-4" id="activityTab" role="tablist">
                        <li className="nav-item" role="presentation">
                            <button
                                className={`nav-link ${actividad === 'Correr' ? 'active' : ''}`}
                                onClick={() => setActividad('Correr')}
                            >
                                Correr
                            </button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button
                                className={`nav-link ${actividad === 'Ciclismo' ? 'active' : ''}`}
                                onClick={() => setActividad('Ciclismo')}
                            >
                                Ciclismo
                            </button>
                        </li>
                    </ul>

                    {actividad && (
                        <div className="tab-content">
                            <div className="tab-pane fade show active">
                                <h4>{actividad}</h4>
                                <Bar data={data} />
                                <div className="mt-4">
                                    <input
                                        type="number"
                                        className="form-control mb-2"
                                        placeholder="Agregar distancia (km)"
                                        value={distancia}
                                        onChange={(e) => setDistancia(parseFloat(e.target.value) || 0)}
                                    />
                                    <button className="btn btn-success" onClick={agregarDistancia}>Agregar Distancia</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div className="d-flex justify-content-center mt-4">
                {diaSeleccionado && (
                    <button className="btn btn-success px-5 py-2" onClick={() => setModalShow(true)}>
                        + Nuevo Ejercicio
                    </button>
                )}
            </div>

            <NuevoEjercicioModal
                show={modalShow}
                handleClose={() => setModalShow(false)}
                agregarEjercicio={agregarEjercicio}
                diaSeleccionado={diaSeleccionado}
            />
        </div>
    );
};

export default HomeScreen;
