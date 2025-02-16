import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const EliminarEjercicioModal = ({ show, handleClose, ejercicioId }) => {
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // Función para manejar la eliminación del ejercicio
    const handleDelete = async () => {
        const token = localStorage.getItem('x-token');

        if (!token) {
            console.error('No hay token disponible');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`https://fitnesstrack-back.onrender.com/api/ejercicio/${ejercicioId}/eliminar`, {
                method: 'post',
                headers: {
                    'x-token': token,
                },
            });

            const data = await response.json();

            if (response.ok) {
                handleClose(); // Cerrar el modal
                navigate(-1);
            } else {
                console.error('Error al eliminar ejercicio:', data.msg);
            }
        } catch (error) {
            console.error('Error en la solicitud de eliminación:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!show) return null;

    return (
        <div className="modal fade show" tabIndex="-1" style={{ display: 'block' }} aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Eliminar Ejercicio</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleClose}></button>
                    </div>
                    <div className="modal-body">
                        <p>¿Estás seguro de que deseas eliminar este ejercicio? Esta acción no se puede deshacer.</p>
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            data-bs-dismiss="modal"
                            onClick={handleClose}
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            className="btn btn-danger"
                            onClick={handleDelete}
                            disabled={loading}
                        >
                            {loading ? 'Eliminando...' : 'Eliminar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EliminarEjercicioModal;
