import React, { useState, useEffect } from 'react';

const ActualizarPesoModal = ({ show, handleClose, ejercicioId }) => {
    const [formData, setFormData] = useState({
        peso: '',
        fecha: new Date().toISOString().split('T')[0],  // Fecha del día
    });

    // Limpiar el formulario cuando el modal se cierra
    useEffect(() => {
        if (!show) {
            setFormData({
                peso: '',
                fecha: new Date().toISOString().split('T')[0],
            });
        }
    }, [show]);

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
            const response = await fetch(`http://localhost:3000/api/ejercicio/${ejercicioId}/agregar-peso`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-token': token
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (response.ok) {
                handleClose();  // Cerrar el modal al guardar
            } else {
                console.error('Error al actualizar el peso:', data.msg);
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
        }
    };

    if (!show) return null;

    return (
        <div className="modal fade show" tabIndex="-1" style={{ display: 'block' }} aria-labelledby="actualizarPesoModal" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="actualizarPesoModal">Actualizar Peso</h5>
                        <button type="button" className="btn-close" onClick={handleClose}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
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


                            <div className="mb-3">
                                <label className="form-label">Fecha</label>
                                <input
                                    type="date"
                                    name="fecha"
                                    value={formData.fecha}
                                    onChange={handleChange}
                                    className="form-control"
                                    required
                                />
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button type="submit" className="btn btn-primary">Agregar</button>
                            <button type="button" className="btn btn-secondary" onClick={handleClose}>Cancelar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ActualizarPesoModal;
