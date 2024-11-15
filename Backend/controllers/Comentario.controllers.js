
import { query } from '../database/Config.js';
import { v4 as uuidv4 } from 'uuid';

export const ObtenerComentariosPorSalon = async (req, res) => {
    try {
        const { salonId } = req.params;

        // Llamada a la función SQL que obtiene los comentarios del salón
        const result = await query('SELECT * FROM obtener_comentarios_por_salon($1)', [salonId]);


        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No se encontraron comentarios para este salón' });
        }

        res.status(200).json({
            message: 'Comentarios obtenidos con éxito',
            comentarios: result.rows
        });

    } catch (error) {
        console.error('Error al obtener los comentarios:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

export const agregarComentario = async (req, res) => {
    try {
        const { id_usuario, id_salon, comentario, calificacion } = req.body;

        // Generar un ID único para el comentario
        const comentarioId = uuidv4();

        const result = await query(
            'SELECT * FROM agregar_comentario($1, $2, $3, $4, $5)',
            [comentarioId, id_usuario, id_salon, comentario, calificacion]
        );

        const { mensaje, success } = result.rows[0];

        if (!success) {
            return res.status(400).json({
                message: mensaje,
                success: false
            });
        }

        res.status(201).json({
            message: mensaje,
            success: true
        });

    } catch (error) {
        console.error('Error al agregar comentario:', error);
        res.status(500).json({
            message: 'Error del servidor al agregar el comentario',
            success: false
        });
    }
};


export const eliminarComentario = async (req, res) => {
    const { comentarioId } = req.params;

    if (!comentarioId) return res.status(400).json({ message: 'El ID del comentario es obligatorio' });

    try {
        // Llamar al procedimiento para cambiar el estado del comentario
        await query('CALL cambiar_estado_comentario($1)', [comentarioId]);

        res.status(200).json({ message: 'Comentario marcado como no disponible exitosamente.' });
    } catch (error) {
        console.error('Error al cambiar el estado del comentario:', error);
        res.status(500).json({ message: 'Error del servidor al marcar el comentario.' });
    }
};