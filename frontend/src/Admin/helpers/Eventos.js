

import axios from 'axios';
import { toast } from 'react-hot-toast';


export const CrearSalonEvento = async (
    Nombre,
    Dimensiones_Area,
    Capacidad_Personas,
    Valor_Hora,
    Url_Image,
    Descripcion,
    Id_Usuario
) => {
    try {
        const response = await axios.post('http://localhost:3000/salon/CSalon', {
            nombre_salon: Nombre,
            dimensiones_area: Dimensiones_Area,
            capacidad: Capacidad_Personas,
            valor_hora: Valor_Hora,
            url_imagen: Url_Image,
            descripcion: Descripcion,
            estado: 'Disponible', // Puedes ajustar esto si el estado es dinámico
            id_usuario: Id_Usuario,
        });

        if (response.status === 201) {
            console.log(response.data.message);
            return {
                success: true,
                message: response.data.message,
                id: response.data.id,
            };
        } else {
            return {
                success: false,
                message: 'No se pudo crear el salón',
            };
        }
    } catch (error) {
        console.error('Error al crear el salón:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Error al crear el salón',
        };
    }
};


export const getSalonesByUsuario = async (idUsuario) => {
    try {
        const response = await axios.get('http://localhost:3000/user/salones', {
            params: {
                id_usuario: idUsuario
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener salones:', error);
        throw new Error('Hubo un problema al obtener los salones.');
    }
};


export const submitComentario = async (iduser, salonId, comentario, calificacion) => {
    try {
        const response = await axios.post('http://localhost:3000/comentario', {
            id_usuario: iduser,
            id_salon: salonId,
            comentario: comentario,
            calificacion: calificacion
        });

        if (response.data.success) {
            toast.success(response.data.message || 'Comentario agregado correctamente');
            return true;
        } else {
            toast.error('Hubo un problema al agregar el comentario');
            return false;
        }
    } catch (error) {
        console.error('Error al agregar comentario:', error);
        toast.error('No se pudo agregar el comentario, intenta nuevamente.');
        return false;
    }
};


export const getComentariosBySalon = async (salonId) => {
    try {
      const response = await axios.get(`http://localhost:3000/comentario/${salonId}`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // Manejar el caso cuando no se encuentran comentarios
        console.warn('No se encontraron comentarios:', error.response.data.message);
        return { comentarios: [] }; // Devuelve un array vacío en lugar de lanzar un error
      }
      console.error('Error al obtener los comentarios:', error);
      throw new Error('Hubo un problema al obtener los comentarios.');
    }
  };
  


export const eliminarComentario = async (comentarioId) => {
    try {
        const response = await axios.delete(`http://localhost:3000/comentario/${comentarioId}`);
        return response.data;
    } catch (error) {
        console.error('Error al eliminar el comentario:', error);
        throw new Error('Hubo un problema al eliminar el comentario.');
    }
}