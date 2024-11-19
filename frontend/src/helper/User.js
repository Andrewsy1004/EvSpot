
import axios from 'axios';
import useAuthStore from "../Store/authStore";


export const getUser = async (userId) => {
    try {
        const response = await axios.get(`http://localhost:3000/user/infoUser/${userId}`);
        const formattedUser = formatUser(response.data);
        return formattedUser;
    } catch (error) {
        console.error('Error al obtener el usuario:', error.response?.data || error.message);
        throw error;
    }
};


export const updateUser = async (userId, updatedData) => {
    const updateUser = useAuthStore.getState().actualizarInfo;
    const apiUrl = `http://localhost:3000/user/updateUser/${userId}`;

    try {
        const response = await axios.put(apiUrl, updatedData);
        
        console.log({updatedData})
        updateUser(updatedData.nombre, updatedData.icono);
        
        return {
            success: true,
            message: response.data.message
        };
         

    } catch (error) {
        console.error('Error al actualizar el usuario:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'No se pudo actualizar el usuario');
    }
};


export const formatUser = (rawUser) => {
    return {
        nombre: rawUser.usuario_nombre,
        apellido: rawUser.usuario_apellido,
        cc: rawUser.usuario_cc,
        correo: rawUser.usuario_correo,
        telefono: rawUser.usuario_telefono,
        contrasena: rawUser.usuario_contrasena,
        rol: rawUser.usuario_rol,
        status: rawUser.usuario_status,
        icono: rawUser.usuario_icono,
    };
};
