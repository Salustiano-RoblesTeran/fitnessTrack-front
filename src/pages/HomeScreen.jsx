import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import NuevoEjercicioModal from '../components/modals/NuevoEjercicioModal';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import 'bootstrap/dist/css/bootstrap.min.css';
import AgregarActividadModal from '../components/modals/NuevaActividadModal';

const HomeScreen = () => {
    const [diaSeleccionado, setDiaSeleccionado] = useState('');
    const [ejercicios, setEjercicios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    const [modalActividadShow, setModalActividadShow] = useState(false);
    const [actividad, setActividad] = useState('Correr'); // Actividad predeterminada
    const [rango, setRango] = useState('ultimaSemana');
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [distancias, setDistancias] = useState([]);

    const days = [
        { name: "Lun", fullName: "Lunes", key: "Lunes" },
        { name: "Mar", fullName: "Martes", key: "Martes" },
        { name: "Mié", fullName: "Miércoles", key: "Miércoles" },
        { name: "Jue", fullName: "Jueves", key: "Jueves" },
        { name: "Vie", fullName: "Viernes", key: "Viernes" },
        { name: "Sáb", fullName: "Sábado", key: "Sabado" },
        { name: "Dom", fullName: "Domingo", key: "Domingo" }
    ];

    const navigate = useNavigate();
    const location = useLocation();

    // Resetear estado cuando se navega a Home
    useEffect(() => {
        if (location.pathname === '/') {
            setDiaSeleccionado('');
            setEjercicios([]);
        }
    }, [location]);

    // Obtener ejercicios al seleccionar un día
    useEffect(() => {
        if (diaSeleccionado) {
            obtenerEjercicios(diaSeleccionado);
        }
    }, [diaSeleccionado]);

    // Obtener ejercicios desde la API
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
            console.log('Ejercicios obtenidos:', data); // Verifica los datos obtenidos

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

    // Función para agregar un nuevo ejercicio
    const agregarEjercicio = (ejercicio) => {
        setEjercicios([...ejercicios, ejercicio]);
    };

    // Redirigir al detalle del ejercicio
    const handleEjercicioClick = (ejercicioId) => {
        navigate(`/ejercicio/${ejercicioId}`);
    };

    // Obtener datos de la actividad
    const obtenerDatosActividad = async () => {
        const token = localStorage.getItem('x-token');
    
        if (!token) {
            console.error('No hay token disponible');
            window.location.href = '/login';
            return;
        }
    
        setLoading(true);
    
        try {
            // Configura las fechas de inicio y fin según el rango seleccionado
            let query = `?rango=${rango}`;
            if (rango === 'personalizado') {
                query += `&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;
            }
    
            const endpoint = actividad === 'Correr'
                ? `http://localhost:3000/api/actividad/correr${query}`
                : `http://localhost:3000/api/actividad/ciclismo${query}`;
    
            const response = await fetch(endpoint, {
                method: 'GET',
                headers: {
                    'x-token': token,
                },
            });
    
            const data = await response.json();
            console.log('Datos de actividad:', data); // Verifica los datos obtenidos
    
            if (!response.ok) {
                throw new Error(data.msg || 'Error al obtener datos');
            }
    
            // Actualizamos las distancias con los datos filtrados
            if (data.ok) {
                setDistancias(data.registros);
            }
    
        } catch (error) {
            console.error('Error al obtener datos:', error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (actividad) {
            obtenerDatosActividad();
        }
    }, [actividad]);

    // Calcular la distancia total y el tiempo total
    const distanciaTotal = distancias.reduce((acc, curr) => acc + curr.distancia, 0);
    const tiempoTotal = distancias.reduce((acc, curr) => acc + curr.minutos, 0);

    // Configuración de la gráfica
    const data = {
        labels: distancias.map((registro) => registro.fecha).reverse(),
        datasets: [
            {
                label: `${actividad} - Distancia (km)`,
                data: distancias.map((registro) => registro.distancia).reverse(),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
        ],
    };
    

    // Manejar cambio de rango (última semana, último mes, personalizado)
    const handleRangoChange = (e) => {
        setRango(e.target.value);
        if (e.target.value === 'personalizado') {
            setFechaInicio('');
            setFechaFin('');
        }
    };

    // Verificación de actividad y fechas
    useEffect(() => {
        console.log('Actividad seleccionada:', actividad);
        obtenerDatosActividad();
    }, [actividad]);

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
                                        <option value="ultimaSemana">Última semana</option>
                                        <option value="ultimoMes">Último mes</option>
                                        <option value="personalizado">Personalizado</option>
                                    </select>

                                    {rango === 'personalizado' && (
                                        <div className="mt-3">
                                            <input 
                                                type="date" 
                                                className="form-control mb-2"
                                                value={fechaInicio}
                                                onChange={(e) => setFechaInicio(e.target.value)}
                                            />
                                            <input 
                                                type="date" 
                                                className="form-control"
                                                value={fechaFin}
                                                onChange={(e) => setFechaFin(e.target.value)}
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Mostrar gráfica */}
                                <Bar
                                    data={data}
                                    options={{
                                        
                                    }}
                                    style={{ height: '300px', width: '60%', textAlign: 'center'}}  // Ajusta el tamaño (puedes modificar 'height' y 'width' a tu preferencia)
                                    />



                                {/* Mostrar distancias y tiempos */}
                                <div className="mt-4">
                                    <p>Total Distancia: {distanciaTotal} km</p>
                                    <p>Total Tiempo: {tiempoTotal} min</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Modal para agregar ejercicio */}
            <NuevoEjercicioModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                agregarEjercicio={agregarEjercicio}
            />

            {/* Modal para agregar actividad */}
            <AgregarActividadModal
                show={modalActividadShow}
                onHide={() => setModalActividadShow(false)}
            />
        </div>
    );
};

export default HomeScreen;
