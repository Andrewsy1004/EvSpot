
import { query } from '../database/Config.js';
import { v4 as uuidv4 } from 'uuid';

export const createUser = async (req, res) => {
    const { nombre, apellido, cc, correo, telefono, contrasena } = req.body;

    // Validar que todos los campos requeridos estén presentes
    if (!nombre || !apellido || !cc || !correo || !telefono || !contrasena) {
        return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    // Generar un ID único para el usuario
    const id = `${nombre.replace(/\s+/g, '_').slice(0, 30)}_${uuidv4().slice(0, 5)}`;

    try {
        // Llamar al procedimiento almacenado
        await query(
            `CALL insertar_usuario($1, $2, $3, $4, $5, $6, $7, $8)`,
            [id, nombre, apellido, cc, correo, telefono, contrasena, 'Usuario']
        );

        // Respuesta exitosa
        res.status(201).json({ message: 'Usuario creado exitosamente', status: 'ok', UserId: id });

    } catch (error) {
        // Manejar errores de duplicación y otros errores
        if (error.message.includes('ya está registrado')) {
            return res.status(400).json({ message: error.message });
        }
        console.error('Error al crear usuario:', error);
        res.status(500).json({ message: 'Error al crear usuario' });
    }
};

export const loginUser = async (req, res) => {
    const { correo, contrasena } = req.query;

    try {
        const result = await query(
            `select * from buscar_usuario($1, $2)`,
            [correo, contrasena]
        );

        if (result.rows.length > 0) {
            res.status(200).json({
                message: 'Usuario encontrado',
                user: result.rows[0]
            });
        } else {
            res.status(401).json({
                message: 'Correo o contraseña incorrectos'
            });
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ message: 'Error al iniciar sesión' });
    }
};


export const obtenerSalonesDisponibles = async (req, res) => {
    const { id_usuario } = req.query; // Se espera recibir el id_usuario como parámetro de consulta

    try {
        // Verificar si el id_usuario llegó correctamente
        if (!id_usuario) {
            return res.status(400).json({ message: 'El id_usuario es requerido' });
        }

        // Ejecutar la función obtener_salones_disponibles
        const result = await query(
            `SELECT * FROM obtener_salones_disponibles($1)`,
            [id_usuario]
        );

        // Verificar si se encontraron resultados
        if (result.rows.length > 0) {
            res.status(200).json({
                message: 'Salones obtenidos exitosamente',
                salones: result.rows,
            });
        } else {
            res.status(404).json({
                message: 'No se encontraron salones disponibles para el usuario',
            });
        }
    } catch (error) {
        console.error('Error al obtener salones:', error);
        res.status(500).json({ message: 'Error al obtener salones' });
    }
};
export const ObtenerInformacionUserporId = async (req, res) => {
    const { id_usuario } = req.params;

    if (!id_usuario) {
        return res.status(400).json({ message: 'El id es requerido' });
    }

    try {
        // Llamar a la función almacenada
        const result = await query(
            `SELECT * FROM obtener_usuario_por_id($1)`,
            [id_usuario]
        );

        // Verificar si se obtuvieron resultados
        if (result.rows.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });

        res.status(200).json(result.rows[0]);

    } catch (error) {
        console.error('Error al obtener información del usuario:', error);
        if (error.code === 'P0001') { // Código de excepción personalizada
            res.status(404).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Error del servidor' });
        }
    }
};


export const ActualizarInformacionUser = async (req, res) => {
    const { id_usuario } = req.params; // ID del usuario
    const {
        nombre,
        apellido,
        cc,
        correo,
        telefono,
        contrasena,
        rol,
        status,
        icono,
    } = req.body; // Datos a actualizar

    if (!id_usuario) {
        return res.status(400).json({ message: 'El id es requerido' });
    }

    try {
        // Llamar al procedimiento almacenado
        const result = await query(
            `SELECT actualizar_usuario(
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
            )`,
            [
                id_usuario, // $1
                nombre || null, // $2
                apellido || null, // $3
                cc || null, // $4
                correo || null, // $5
                telefono || null, // $6
                contrasena || null, // $7
                rol || null, // $8
                status || null, // $9
                icono || null, // $10
            ]
        );

        // Verificar si el procedimiento lanzó algún error (capturado por la BD)
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado o no se pudo actualizar' });
        }

        res.status(200).json({ message: 'Usuario actualizado correctamente' });
    } catch (error) {
        console.error('Error al actualizar usuario:', error);

        // Manejar errores de PostgreSQL
        if (error.code === 'P0001') { // Excepción personalizada
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Error del servidor' });
        }
    }
};


