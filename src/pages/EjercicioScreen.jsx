import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import ActualizarPesoModal from '../components/ActualizarPesoModal';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const EjercicioScreen = () => {
    const { id } = useParams();
    const [ejercicio, setEjercicio] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const obtenerEjercicio = async () => {
            const token = localStorage.getItem('x-token');

            if (!token) {
                console.error('No hay token disponible');
                window.location.href = '/login';
                return;
            }

            setLoading(true);

            try {
                const response = await fetch(`http://localhost:3000/api/ejercicio/${id}`, {
                    method: 'GET',
                    headers: {
                        'x-token': token,
                    }
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.msg || 'Error al obtener el ejercicio');
                }

                setEjercicio(data);
            } catch (error) {
                console.error('Error al obtener el ejercicio:', error.message);
            } finally {
                setLoading(false);
            }
        };

        obtenerEjercicio();
    }, [id]);

    const actualizarPeso = (nuevoPeso) => {
        setEjercicio({
            ...ejercicio,
            historialPesos: [...ejercicio.historialPesos, nuevoPeso]
        });
    };

    if (loading) {
        return <p className="text-center">Cargando detalles del ejercicio...</p>;
    }

    if (!ejercicio) {
        return <p className="text-center">No se encontró el ejercicio.</p>;
    }

    const { nombreEjercicio, grupoMusculares, dia, series, repeticiones, historialPesos } = ejercicio;

    // Ordenar los datos por fecha
    const sortedPesos = historialPesos.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

    const data = {
        labels: sortedPesos.map(peso =>
            new Date(peso.fecha).toLocaleDateString('es-ES', {
                day: '2-digit', month: '2-digit', year: 'numeric'
            })
        ),
        datasets: [
            {
                label: 'Progreso de peso (kg)',
                data: sortedPesos.map(peso => peso.peso),
                borderColor: 'rgba(54, 162, 235, 1)',
                tension: 0.4,
                fill: false,
                pointRadius: 5,
                pointHoverRadius: 8,
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: 'Progreso del Peso en el Tiempo',
                font: {
                    size: 20,
                    weight: 'bold',
                }
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Fecha',
                    font: {
                        size: 14,
                    }
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Peso (kg)',
                    font: {
                        size: 14,
                    }
                },
            }
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    {/* Tarjeta con los detalles del ejercicio */}
                    <div className="card shadow-lg mb-4">
                        <div className="card-header bg-info text-white">
                            <h5 className="card-title mb-0">{nombreEjercicio}</h5>
                        </div>
                        <div className="card-body">
                            <h6 className="text-muted mb-3">Detalles del Ejercicio</h6>
                            <div className="row">
                                <div className="col-6">
                                    <p><strong>Grupo muscular:</strong> {grupoMusculares}</p>
                                    <p><strong>Día:</strong> {dia}</p>
                                </div>
                                <div className="col-6">
                                    <p><strong>Series:</strong> {series}</p>
                                    <p><strong>Repeticiones:</strong> {repeticiones}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Gráfica de progreso */}
                    <div className="card shadow-lg mb-4">
                        <div className="card-body">
                            <h6 className="text-muted mb-3">Gráfico de Progreso</h6>
                            <div className="chart-container" style={{ height: '400px' }}>
                                <Line data={data} options={options} />
                            </div>
                        </div>
                    </div>

                    {/* Botón para actualizar peso */}
                    <div className="text-center mt-4">
                        <button className="btn btn-success btn-lg" onClick={() => setShowModal(true)}>
                            Actualizar Peso
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal para actualizar peso */}
            <ActualizarPesoModal
                show={showModal}
                handleClose={() => setShowModal(false)}
                actualizarPeso={actualizarPeso}
                ejercicioId={id}
            />
        </div>
    );
};

export default EjercicioScreen;
