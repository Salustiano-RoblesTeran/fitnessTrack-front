import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';

const NuevoActividadModal = ({ show, handleClose }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        tipoActividad: 'Correr', // Valor predeterminado
        distancia: '',
        minutos: '',
        fecha: '', // Fecha inicial vacía
    });

    // Limpiar los campos cuando se cierra el modal y establecer fecha actual
    useEffect(() => {
        if (!show) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                distancia: '',
                minutos: '',
                fecha: '', // Se limpia la fecha
            }));
        } else {
            // Si se abre el modal, establecer la fecha actual por defecto
            setFormData((prevFormData) => ({
                ...prevFormData,
                fecha: new Date().toLocaleDateString(), // Formato local de la fecha
            }));
        }
    }, [show]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const { distancia, minutos, fecha } = formData;

        if (distancia <= 0 || minutos <= 0) {
            setError('La distancia y el tiempo deben ser mayores a 0.');
            return;
        }

        if (!fecha) {
            setError('Debe seleccionar una fecha.');
            return;
        }

        const token = localStorage.getItem('x-token');
        setLoading(true);

        try {
            const endpoint =
                formData.tipoActividad === 'Correr'
                    ? 'https://fitnesstrack-back.onrender.com/api/actividad/correr'
                    : 'https://fitnesstrack-back.onrender.com/api/actividad/ciclismo';

            console.log(formData)

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-token': token,
                },
                body: JSON.stringify({ distancia, minutos, fecha }),
            });

            const data = await response.json();
            console.log(data)

            if (!response.ok) {
                throw new Error(data.msg || 'Error al agregar actividad');
            }

            handleClose(); // Cerrar modal al completar la acción
        } catch (error) {
            console.error('Error al agregar actividad:', error.message);
            setError('No se pudo agregar la actividad. Inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Agregar Nueva Actividad</Modal.Title>
            </Modal.Header>

            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form.Group className="mb-3" controlId="tipoActividad">
                        <Form.Label>Tipo de Actividad</Form.Label>
                        <Form.Select
                            name="tipoActividad"
                            value={formData.tipoActividad} // Vincula el valor al estado
                            onChange={handleChange}
                        >
                            <option value="Correr">Correr</option>
                            <option value="Ciclismo">Ciclismo</option>
                        </Form.Select>

                    </Form.Group>

                    <Form.Group className="mb-3" controlId="distancia">
                        <Form.Label>Distancia (km)</Form.Label>
                        <Form.Control
                            type="number"
                            step="0.1"
                            min="0"
                            placeholder="Ingrese la distancia"
                            name="distancia"
                            value={formData.distancia}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="minutos">
                        <Form.Label>Tiempo (minutos)</Form.Label>
                        <Form.Control
                            type="number"
                            step="1"
                            min="0"
                            placeholder="Ingrese el tiempo en minutos"
                            name="minutos"
                            value={formData.minutos}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    {/* Campo de fecha con valor normal */}
                    <Form.Group className="mb-3" controlId="fecha">
                        <Form.Label>Fecha</Form.Label>
                        <Form.Control
                                    type="date"
                                    name="fecha"
                                    onChange={handleChange}
                                    className="form-control"
                                    required
                        />
                    </Form.Group>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose} disabled={loading}>
                        Cancelar
                    </Button>
                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? <Spinner as="span" animation="border" size="sm" /> : 'Agregar Actividad'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default NuevoActividadModal;
