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
    const [actividad, setActividad] = useState('Correr'); // Actividad predeterminada
    const [distancias, setDistancias] = useState([]);
    const [rango, setRango] = useState('ultimaSemana');
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');

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
            obtenerEjercicios(diaSeleccionado)
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

    const obtenerDatosActividad = async () => {
        const token = localStorage.getItem('x-token');

        if (!token) {
            console.error('No hay token disponible');
            window.location.href = '/login';
            return;
        }

        setLoading(true);

        try {
            const endpoint = actividad === 'Correr'
                ? 'http://localhost:3000/api/actividad/correr'
                : 'http://localhost:3000/api/actividad/ciclismo';

            const response = await fetch(endpoint, {
                method: 'GET',
                headers: {
                    'x-token': token,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.msg || 'Error al obtener datos');
            }

            setDistancias(data.registros.map((registro) => ({
                distancia: registro.distancia,
                fecha: new Date(registro.fecha).toLocaleDateString()
            })));
        } catch (error) {
            console.error('Error al obtener datos:', error.message);
            setDistancias([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (actividad) {
            obtenerDatosActividad();
        }
    }, [actividad]);

    const data = {
        labels: distancias.map((registro) => registro.fecha),
        datasets: [
            {
                label: `${actividad} - Distancia (km)`,
                data: distancias.map((registro) => registro.distancia),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
        ],
    };

    const handleRangoChange = (e) => {
        setRango(e.target.value);
        if (e.target.value === 'personalizado') {
            setFechaInicio('');
            setFechaFin('');
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Rutina Semanal</h2>

            {/* Botón para agregar ejercicio */}
            <div className="text-center mb-4">
                <button
                    className="btn btn-success"
                    onClick={() => setModalShow(true)}
                >
                    Agregar Nuevo Ejercicio
                </button>
            </div>

            {/* Menú de días scrollable */}
            <div className="d-flex justify-content-center mb-4" style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
                {days.map((dia, index) => (
                    <button
                        key={index}
                        className={`btn me-2 ${diaSeleccionado === dia.key ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setDiaSeleccionado(dia.key)}
                        style={{ minWidth: '80px' }}
                    >
                        <span className="d-none d-md-inline">{dia.fullName}</span>
                        <span className="d-inline d-md-none">{dia.name}</span>
                    </button>
                ))}
            </div>

            <div className="text-center mb-4">
                <h4>{days.find(dia => dia.key === diaSeleccionado)?.fullName || ''}</h4>
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

                                {/* Selector de rango */}
                                <div className="mb-3" style={{ width: '250px', margin: '0 auto' }}>
                                    <select 
                                        className="form-select" 
                                        value={rango} 
                                        onChange={handleRangoChange}
                                    >
                                        <option value="ultimaSemana">Última Semana</option>
                                        <option value="ultimoMes">Último Mes</option>
                                        <option value="personalizado">Personalizado</option>
                                    </select>
                                </div>

                                {/* Mostrar fechas solo si se elige 'Personalizado' */}
                                <div className="d-flex gap-3 mb-3" style={{ justifyContent: 'center' }}>
                                    {rango === 'personalizado' && (
                                        <div style={{ width: '150px' }}>
                                            <label>Fecha de Inicio</label>
                                            <input 
                                                type="date" 
                                                className="form-control" 
                                                value={fechaInicio} 
                                                onChange={(e) => setFechaInicio(e.target.value)} 
                                            />
                                        </div>
                                    )}

                                    {rango === 'personalizado' && (
                                        <div style={{ width: '150px' }}>
                                            <label>Fecha de Fin</label>
                                            <input 
                                                type="date" 
                                                className="form-control" 
                                                value={fechaFin} 
                                                onChange={(e) => setFechaFin(e.target.value)} 
                                            />
                                        </div>
                                    )}
                                </div>


                                <div className="mb-5" style={{ maxWidth: '800px', margin: '0 auto' }}>
                                    <Bar data={data} options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                    }} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
            
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
