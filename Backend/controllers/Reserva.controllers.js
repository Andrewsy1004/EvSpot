
import { query } from '../database/Config.js';
import { v4 as uuidv4 } from 'uuid';

export const ObtenerReservasPorUsuario = async (req, res) => {
    const { id_usuario } = req.params;

    try {
        // Llamada a la función almacenada para obtener reservas por usuario
        const result = await query('SELECT * FROM obtener_reservas_por_cliente($1)', [id_usuario]);

        // Si no hay filas en el resultado, puede significar que no hay reservas (aunque en este caso debería lanzarse una excepción en el procedimiento)
        if (result.rows.length === 0) {
            return res.status(404).json({ message: `No se encontraron reservas para el usuario con id ${id_usuario}` });
        }

        // Enviar los datos como respuesta
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al obtener reservas:', error);

        // Verificar si el error es específico de las excepciones en PostgreSQL
        if (error.message.includes('no existe')) {
            return res.status(404).json({ message: `El usuario con id ${id_usuario} no existe.` });
        }

        if (error.message.includes('no tiene reservas registradas')) {
            return res.status(404).json({ message: `El usuario con id ${id_usuario} no tiene reservas registradas.` });
        }

        // Error genérico para otros errores
        res.status(500).json({ message: 'Error al obtener reservas' });
    }
};


export const EliminarReserva = async (req, res) => {
    const { id_reserva } = req.params;

    if (!id_reserva) return res.status(400).json({ message: 'El id de la reserva es requerido' });

    try {
        // Ejecutar el procedimiento almacenado
        await query('CALL eliminarReserva($1)', [id_reserva]);

        // Responder con éxito
        res.status(200).json({ success: true, message: `Reserva con ID ${id_reserva} ha sido eliminada exitosamente.` });
    } catch (error) {
        // Manejar errores
        console.error('Error al eliminar la reserva:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};


export const actualizarReservaPorId = async (req, res) => {
    const { id_reserva } = req.params; // ID de la reserva a actualizar
    const { id_salon, fecha_inicio, fecha_final, num_personas } = req.body; // Datos de la reserva

    // Validar parámetros requeridos
    if (!id_reserva) {
        return res.status(400).json({ message: 'El id de la reserva es requerido' });
    }

    try {
        // Llamar al procedimiento almacenado
        const queryText = `
            CALL actualizar_reserva($1, $2, $3, $4, $5)
        `;

        // Ejecutar la consulta con los parámetros
        await query(queryText, [
            id_reserva,
            id_salon || null,
            fecha_inicio || null,
            fecha_final || null,
            num_personas || null,
        ]);

        // Respuesta de éxito
        res.status(200).json({ message: 'Reserva actualizada correctamente' });
    } catch (error) {
        // Detectar errores específicos generados por el procedimiento
        if (error.message.includes('no existe')) {
            // Error de referencia (reserva o salón no encontrados)
            return res.status(404).json({ error: error.message });
        } else if (error.message.includes('Ya existe una reserva')) {
            // Conflicto de horarios
            return res.status(409).json({ error: error.message });
        } else {
            // Otros errores no controlados
            console.error('Error al actualizar reserva:', error.message);
            return res.status(500).json({ error: 'Error interno del servidor', details: error.message });
        }
    }
};


export const crearReserva = async (req, res) => {
    try {
        const {
            id_salon,
            id_usuario,
            fecha_inicio,
            fecha_final,
            num_personas
        } = req.body;

        if (!id_salon || !id_usuario || !fecha_inicio || !fecha_final || !num_personas) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        const id_reserva = uuidv4();

        // Llamar al procedimiento almacenado para insertar la reserva
        await query(
            'CALL insertar_reserva($1, $2, $3, $4, $5, $6)', // Llamada al procedimiento con los parámetros
            [id_reserva, id_salon, id_usuario, fecha_inicio, fecha_final, num_personas] // Parámetros para el procedimiento
        );

        // Respuesta de éxito si la reserva fue insertada correctamente
        res.status(200).json({ message: 'Reserva creada exitosamente' });
    } catch (error) {
        console.error('Error al crear la reserva:', error);

        // Enviar mensaje de error al cliente
        if (error.message.includes('El salón ya tiene una reserva en el rango de fechas especificado')) {
            res.status(400).json({ message: error.message });
        } else if (error.message.includes('no existe')) {
            res.status(404).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Error del servidor' });
        }
    }
};