
import axios from 'axios';
import useAuthStore from "../../Store/authStore.js";

export const RegistrarUsuario = async (Nombre, Apellido, Cc, Telefono, Correo, Contrasena) => {
    const loginAction = useAuthStore.getState().login;

    try {
        const response = await axios.post('http://localhost:3000/user', {
            nombre: Nombre,
            apellido: Apellido,
            cc: Cc,
            correo: Correo,
            telefono: Telefono,
            contrasena: Contrasena
        });

        if (response.status === 201) {
            const data = response.data;
            console.log(data);

            loginAction(data.UserId, Correo, Nombre, "Usuario");

            return { success: true, message: 'Usuario registrado exitosamente' };
        } else {
            return { success: false, message: 'Error al registrar el usuario' };
        }
    } catch (error) {
        console.error('Error al registrar el usuario:', error);

        // Captura de errores específicos
        if (error.response && error.response.status === 500) {
            return { success: false, message: 'Error interno del servidor' };
        } else if (error.response && error.response.status === 400) {
            const errorMessage = error.response.data.message || 'Datos de registro incorrectos';
            return { success: false, message: errorMessage };
        } else {
            return { success: false, message: 'No se pudo conectar al servidor' };
        }
    }
};


export const IniciarSesion = async (Correo, Contrasena) => {
    const loginAction = useAuthStore.getState().login;

    try {
        // Realiza la solicitud GET con los parámetros en la URL
        const response = await axios.get('http://localhost:3000/user', {
            params: {
                correo: Correo,
                contrasena: Contrasena
            }
        });
        
      
        if (response.status === 200) {
            const data = response.data;
            
            loginAction( data.user.id, Correo, data.user.nombre, data.user.rol, data.user.icono);

            return {
                success: true,
                message: 'Inicio de sesión exitoso'
            };

        } else {
            return {
                success: false,
                message: 'Error al iniciar sesión'
            };
        }

    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Error al iniciar sesión'
        };
    }
};