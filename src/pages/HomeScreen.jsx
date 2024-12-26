import React, { useState, useEffect } from 'react';

const HomeScreen = () => {
    const [diaSeleccionado, setDiaSeleccionado] = useState('');
    const [ejercicios, setEjercicios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dias] = useState(['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']);

    useEffect(() => {
        if (diaSeleccionado) {
            obtenerEjercicios(diaSeleccionado);
        }
    }, [diaSeleccionado]);

    const obtenerEjercicios = async (dia) => {
        const token = localStorage.getItem('x-token');

        if (!token) {
            console.error('No hay token disponible');
            window.location.href = '/login';  // Redirige al login si no hay token
            return;
        }

        setLoading(true);  // Activa el spinner de carga

        try {
            const response = await fetch(`http://localhost:3000/api/ejercicio?dia=${dia}`, {
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

    const handleNuevoEjercicio = () => {
        window.location.href = '/nuevo-ejercicio';
    };

    const obtenerUltimoPeso = (historialPesos) => {
        return historialPesos.length > 0 ? historialPesos[historialPesos.length - 1].peso : 'N/A';
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Rutina Semanal</h2>

            <div className="row justify-content-center mb-4">
                {dias.map((dia) => (
                    <div key={dia} className="col-6 col-md-3 mb-2 d-flex justify-content-center">
                        <button
                            className={`btn w-100 ${diaSeleccionado === dia ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => setDiaSeleccionado(dia)}
                        >
                            {dia}
                        </button>
                    </div>
                ))}
            </div>

            <div className="text-center mb-4">
                <h4>{diaSeleccionado || 'Selecciona un día'}</h4>
            </div>

            {loading ? (
                <p className="text-center">Cargando ejercicios...</p>
            ) : ejercicios.length > 0 ? (
                <ul className="list-group">
                    {ejercicios.map((ejercicio) => (
                        <li key={ejercicio._id} className="list-group-item d-flex flex-column flex-md-row justify-content-between align-items-center">
                            <div>
                                <span className="fw-bold">{ejercicio.nombreEjercicio}</span>
                                <p className="d-block text-muted font-bold">{ejercicio.grupoMusculares}</p> {/* Grupo muscular en gris */}
                            </div>
                            <span className="text-muted">
                                {ejercicio.series} x {ejercicio.repeticiones} - {obtenerUltimoPeso(ejercicio.historialPesos)} kg
                            </span>
                        </li>
                    ))}
                </ul>
            ) : diaSeleccionado && (
                <p className="text-center">No hay ejercicios para este día.</p>
            )}

            <div className="d-flex justify-content-center mt-4">
                <button className="btn btn-success px-5 py-2" onClick={handleNuevoEjercicio}>
                    + Nuevo Ejercicio
                </button>
            </div>
        </div>
    );
};

export default HomeScreen;
