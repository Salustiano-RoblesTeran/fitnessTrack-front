import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const HomeScreen = () => {
    const [diaSeleccionado, setDiaSeleccionado] = useState('');
    const [ejercicios, setEjercicios] = useState([]);
    const [dias] = useState(['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']);

    useEffect(() => {
        if (diaSeleccionado) {
            obtenerEjercicios(diaSeleccionado);
        }
    }, [diaSeleccionado]);

    const obtenerEjercicios = async (dia) => {
        try {
            const response = await fetch(`http://localhost:3000/api/ejercicios?dia=${dia}`);
            const data = await response.json();
            setEjercicios(data);
        } catch (error) {
            console.error('Error al obtener ejercicios:', error);
        }
    };

    const handleNuevoEjercicio = () => {
        window.location.href = '/nuevo-ejercicio';
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Rutina Semanal</h2>
            
            {/* Días en formato responsivo */}
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

            {ejercicios.length > 0 ? (
                <ul className="list-group">
                    {ejercicios.map((ejercicio) => (
                        <li key={ejercicio._id} className="list-group-item d-flex flex-column flex-md-row justify-content-between align-items-center">
                            <span className="fw-bold">{ejercicio.nombreEjercicio}</span>
                            <span className="text-muted">
                                {ejercicio.series} x {ejercicio.repeticiones} - {ejercicio.peso} kg
                            </span>
                        </li>
                    ))}
                </ul>
            ) : diaSeleccionado && (
                <p className="text-center">No hay ejercicios para este día.</p>
            )}

            {/* Botón de nuevo ejercicio */}
            <div className="d-flex justify-content-center mt-4">
                <button className="btn btn-success px-5 py-2" onClick={handleNuevoEjercicio}>
                    + Nuevo Ejercicio
                </button>
            </div>
        </div>
    );
};

export default HomeScreen;
