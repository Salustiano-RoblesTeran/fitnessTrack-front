import React, { useState, useEffect } from 'react';

const EditarEjercicioModal = ({ show, handleClose, ejercicio }) => {
    const [formData, setFormData] = useState({
        nombreEjercicio: '',
        grupoMusculares: '',
        dia: '',
        series: '',
        repeticiones: '',
        peso: '',
    });

    const diasSemana = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sábado", "Domingo"];
    const gruposMusculares = ["Pecho (Pectorales)", "Espalda", "Piernas", "Hombros", "Biceps", "Tríceps", "Core", "Pantorrilla (Gemelos)"];

    // Cargar los datos del ejercicio cuando se abre el modal
    useEffect(() => {
        if (ejercicio) {
            setFormData({
                nombreEjercicio: ejercicio.nombreEjercicio,
                grupoMusculares: ejercicio.grupoMusculares,
                dia: ejercicio.dia,
                series: ejercicio.series,
                repeticiones: ejercicio.repeticiones,
                peso: ejercicio.historialPesos && ejercicio.historialPesos.length > 0 ? ejercicio.historialPesos[0].peso : '',
            });
        }
    }, [show, ejercicio]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('x-token');

        try {
            const updatedHistorialPesos = ejercicio.historialPesos.length > 0
                ? [{ peso: formData.peso }, ...ejercicio.historialPesos.slice(1)]
                : [{ peso: formData.peso }];
            
            const response = await fetch(`https://fitnesstrack-back.onrender.com/api/ejercicio/${ejercicio._id}/actualizar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-token': token
                },
                body: JSON.stringify({
                    ...formData,
                    historialPesos: updatedHistorialPesos
                })
            });

            const data = await response.json();
            if (response.ok) {
                handleClose(); // Cerrar el modal después de actualizar el ejercicio
            } else {
                console.error('Error al actualizar ejercicio:', data.msg);
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
        }
    };

    if (!show) return null;

    return (
        <div className="modal fade show" tabIndex="-1" style={{ display: 'block' }} aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Editar Ejercicio</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleClose}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label">Nombre del Ejercicio</label>
                                <input
                                    type="text"
                                    name="nombreEjercicio"
                                    value={formData.nombreEjercicio}
                                    onChange={handleChange}
                                    className="form-control"
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Grupo Muscular</label>
                                <select
                                    name="grupoMusculares"
                                    value={formData.grupoMusculares}
                                    onChange={handleChange}
                                    className="form-select"
                                    required
                                >
                                    <option value="">Seleccionar</option>
                                    {gruposMusculares.map((grupo) => (
                                        <option key={grupo} value={grupo}>{grupo}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Día</label>
                                <select
                                    name="dia"
                                    value={formData.dia}
                                    onChange={handleChange}
                                    className="form-select"
                                    required
                                >
                                    <option value="">Seleccionar</option>
                                    {diasSemana.map((dia) => (
                                        <option key={dia} value={dia}>{dia}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Series</label>
                                <input
                                    type="number"
                                    name="series"
                                    value={formData.series}
                                    onChange={handleChange}
                                    className="form-control"
                                    min="1"
                                    max="10"
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Repeticiones</label>
                                <input
                                    type="number"
                                    name="repeticiones"
                                    value={formData.repeticiones}
                                    onChange={handleChange}
                                    className="form-control"
                                    min="1"
                                    max="30"
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Peso (kg)</label>
                                <input
                                    type="text" 
                                    name="peso"
                                    value={formData.peso}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        // Validar entrada: permitir números, puntos y comas
                                        const validValue = value.replace(/[^0-9.,]/g, '');
                                        setFormData({ ...formData, peso: validValue });
                                    }}
                                    onBlur={(e) => {
                                        // Convertir automáticamente comas en puntos al salir del campo
                                        const value = e.target.value.replace(',', '.');
                                        setFormData({ ...formData, peso: value });
                                    }}
                                    className="form-control"
                                    required
                                />
                            </div>

                        </div>

                        <div className="modal-footer">
                            <button type="submit" className="btn btn-primary">Actualizar</button>
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleClose}>Cancelar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditarEjercicioModal;
