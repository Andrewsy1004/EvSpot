
import { query } from '../database/Config.js';
import { v4 as uuidv4 } from 'uuid';

export const ObtenerSalonPorId = async (req, res) => {
  try {
    const { salonId } = req.params;

    // Llamada a la función SQL que obtiene el salón
    const result = await query(
      'SELECT * FROM obtener_salon_por_id($1)',
      [salonId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Salón no encontrado' });
    }

    res.status(200).json({
      message: 'Salón encontrado',
      salon: result.rows[0]
    });

  } catch (error) {
    console.error('Error al obtener el salón:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

export const actualizarSalonPorId = async (req, res) => {
  try {
    const { salonId } = req.params; // ID del salón a actualizar
    const {
      nombre_salon,
      dimensiones_area,
      capacidad,
      valor_hora,
      url_imagen,
      descripcion,
      estado
    } = req.body;

    // Llamada a la función SQL que actualiza el salón
    const result = await query(`
        SELECT actualizar_salon_eventos(
          $1, $2, $3, $4, $5, $6, $7, $8
        )`,
      [
        salonId,
        nombre_salon || null,
        dimensiones_area || null,
        capacidad || null,
        valor_hora || null,
        url_imagen || null,
        descripcion || null,
        estado || null
      ]
    );

    // Verifica si se realizó la actualización
    if (result.rowCount > 0) {
      res.status(200).json({ message: 'Salón actualizado exitosamente' });
    } else {
      res.status(404).json({ message: 'Salón no encontrado' });
    }
  } catch (error) {
    console.error('Error al actualizar salón:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};


export const ObtenerTodosLosSalones = async (req, res) => {
  try {
    const result = await query(
      `SELECT * FROM vista_salones_disponibles;`
    );

    res.status(200).json({
      message: 'Salones obtenidos exitosamente',
      salones: result.rows
    });
  } catch (error) {
    console.error('Error al obtener salones:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};



export const obtenerTodosSalones = async (req, res) => {
  try {
    // Usar la función 'obtener_salones_propietarios' en lugar de la vista
    const consultaSQL = `SELECT * FROM obtener_salones_propietarios();`;

    // Ejecutar la consulta
    const result = await query(consultaSQL);

    console.log(result.rows);

    // Devolver los datos obtenidos como respuesta en formato JSON
    res.status(200).json({
      message: 'Salones disponibles obtenidos exitosamente',
      salones: result.rows,
    });
  } catch (error) {
    console.error('Error al obtener los salones disponibles:', error);
    res.status(500).json({ error: 'Error al obtener los salones disponibles' });
  }
};

export const EliminarSalonPorId = async (req, res) => {
  try {
    const { salonId } = req.params;

    console.log('Salón a eliminar:', salonId);

    // Ejecutar el procedimiento almacenado
    const result = await query(
      'CALL ElimarSalon($1)',
      [salonId]
    );

    // Respuesta de éxito si se ejecuta correctamente
    res.status(200).json({ message: 'Salón marcado como no disponible exitosamente' });
  } catch (error) {
    console.error('Error al marcar el salón como no disponible:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};


export const crearSalon = async (req, res) => {
  const {
    nombre_salon,
    dimensiones_area,
    capacidad,
    valor_hora,
    url_imagen,
    descripcion,
    estado,
    id_usuario
  } = req.body;

  if (!nombre_salon || !dimensiones_area || !capacidad || !valor_hora || !url_imagen || !descripcion || !estado || !id_usuario) {
    return res.status(400).json({ message: 'Todos los campos son requeridos' });
  }

  // Generar el ID combinando el nombre del salón y un UUID
  const id = `${nombre_salon.replace(/\s+/g, '_')}_${uuidv4()}`;

  try {
    // Llamada al procedimiento almacenado
    const result = await query(
      `CALL insertar_salon_evento($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [id, nombre_salon, dimensiones_area, capacidad, valor_hora, url_imagen, descripcion, estado, id_usuario]
    );

    res.status(201).json({
      message: 'Salón creado exitosamente',
      id: id
    });


  } catch (error) {
    console.error('Error al crear el salón:', error);
    res.status(500).json({ message: 'Error al crear el salón' });
  }
};


export const obtenerSalonesDisponibles = async (req, res) => {
  const { id_usuario } = req.query;  // Cambiado a req.query para parámetros de consulta

  try {
    // Verificar si el id_usuario llegó correctamente
    if (!id_usuario) {
      return res.status(400).json({ message: 'El id_usuario es requerido' });
    }

    // Ejecuta la consulta en la vista o función
    const result = await query(
      `SELECT * FROM vista_salones_disponibles WHERE id_usuario = $1`,
      [id_usuario]
    );

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


export const getEstadisticasPorUsuario = async (req, res) => {
  const { id_usuario } = req.params;

  try {
    // Ejecutar la función almacenada en la base de datos
    const result = await query(
      `SELECT * FROM obtener_estadisticas_por_usuario($1)`,
      [id_usuario]
    );

    // Verificar si se obtuvieron datos
    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'No se encontraron estadísticas para este usuario.',
      });
    }

    // Devolver las estadísticas al cliente
    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor.',
    });
  }
};

export const getDetallesReservasPorSalon = async (req, res) => {
  const { id_usuario } = req.params;

  try {
    // Ejecutar la función almacenada en PostgreSQL
    const result = await query(
      `SELECT * FROM obtener_detalles_reservas_por_salon($1)`,
      [id_usuario]
    );

    // Validar si hay datos
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No se encontraron reservas para los salones administrados por este usuario.',
      });
    }

    // Enviar respuesta al cliente
    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error al obtener los detalles de reservas por salón:', error.message);

    // Manejar error específico de permisos
    if (error.message.includes('El usuario no tiene permisos')) {
      return res.status(403).json({
        success: false,
        message: 'Acceso denegado: El usuario no tiene permisos para ejecutar esta operación.',
      });
    }

    // Manejar errores genéricos
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor.',
    });
  }
};
