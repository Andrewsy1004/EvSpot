
import axios from 'axios';

export const obtenerEstadisticasPorSalon = async (idUsuario) => {
    try {
        const url = `http://localhost:3000/salon/estadisticas/${idUsuario}`;

        // Realizar la petición GET al endpoint
        const response = await axios.get(url);

        return response.data.data;

    } catch (error) {
        if (error.response) {
            console.error('Error en la respuesta del servidor:', error.response.data);
        } else {
            console.error('Error al realizar la petición:', error.message);
        }
    }
};



export const obtenerEstadisticasUserSalon = async (idUsuario) => {
    try {
        const url = `http://localhost:3000/salon/estadisticasSalon/${idUsuario}`;

        const response = await axios.get(url);

        // Agrupar los datos por 'nombre_salon'
        const datosAgrupados = response.data.data.reduce((acumulador, item) => {
            const { nombre_salon, nombre_cliente, fecha_reserva, monto_pagado } = item;

            // Si el salón no existe en el acumulador, lo inicializamos
            if (!acumulador[nombre_salon]) {
                acumulador[nombre_salon] = {
                    nombre_salon,
                    reservas: [],
                };
            }

            // Agregamos la reserva al salón correspondiente
            acumulador[nombre_salon].reservas.push({
                cliente: nombre_cliente,
                fecha: fecha_reserva,
                total: parseFloat(monto_pagado).toFixed(2), // Convertimos a número con 2 decimales
            });

            return acumulador;
        }, {});

        // Convertimos el objeto en un array para facilitar su manejo en el frontend
        return Object.values(datosAgrupados);
    } catch (error) {
        if (error.response) {
            console.error("Error en la respuesta del servidor:", error.response.data);
        } else {
            console.error("Error al realizar la petición:", error.message);
        }
        return []; // Retornar un array vacío en caso de error
    }
};