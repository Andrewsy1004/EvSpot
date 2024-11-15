

import axios from 'axios';
import { toast } from 'react-hot-toast';

const BASE_URL = 'http://localhost:3000';

export const obtenerSalonesDisponibles = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/salon`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener los salones disponibles:', error);
        throw error;
    }
};

export const CrearReserva = async (id_salon, id_usuario, fecha_inicio, fecha_final, num_personas) => {
    try {
        const response = await axios.post(`${BASE_URL}/reserva/crearReserva`, {
            id_salon,
            id_usuario,
            fecha_inicio,
            fecha_final,
            num_personas
        });

        return {
            success: true,
            message: response.data.message
        };


    } catch (error) {
        console.error('Error al crear la reserva:', error);
        throw error;
    }
}

export const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};



export const obtenerReservasPorUsuario = async (idUsuario) => {
    try {
        const url = `http://localhost:3000/reserva/${idUsuario}`;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error al obtener reservas:', error.message);
        throw error;
    }
};

export const eliminarReservaporId = async (idReserva) => {
    try {
        const url = `http://localhost:3000/reserva/${idReserva}`;
        const response = await axios.delete(url);

        return {
            success: true,
            message: response.data.message
        };

    } catch (error) {
        console.error('Error al eliminar la reserva:', error.message);
        throw error;
    }
};


export const ActualizarReserva = async (idReserva, updateData) => {
    try {
        const url = `http://localhost:3000/reserva/${idReserva}`;
        const response = await axios.put(url, updateData);

        return {
            success: true,
            message: response.data.message,
        };
    } catch (error) {
        console.error('Error al actualizar la reserva:', error.message);

        if (error.response && error.response.status === 409) {
            toast.error('Conflicto: Ya existe una reserva con esos datos o hay un conflicto de fechas.');
        } else {
            toast.error('Error al actualizar la reserva. Por favor, inténtalo de nuevo.');
        }

        return {
            success: false,
            message: error.response?.data?.message || 'Error inesperado.',
        };
    }
};


export const obtenerFechaLocal = () => {
    const ahora = new Date();
    const tzOffset = ahora.getTimezoneOffset() * 60000; // Diferencia de huso horario en ms
    const fechaLocal = new Date(ahora - tzOffset).toISOString().slice(0, 16);
    return fechaLocal;
};
