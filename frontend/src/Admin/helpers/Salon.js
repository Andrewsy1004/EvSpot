
import axios from 'axios';

const BASE_URL = 'http://localhost:3000/salon';


export const getSalonById = async (idSalon) => {
  try {
    const response = await axios.get(`${BASE_URL}/${idSalon}`);
    return response.data.salon;
  } catch (error) {
    console.error('Error al obtener el salón:', error);
    throw new Error('Hubo un problema al obtener el salón.');
  }
}



export const actualizarSalon = async (salonId, updateData) => {
  try {
    const response = await axios.put(`${BASE_URL}/${salonId}`, updateData);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar el salón:', error);
    throw new Error('No se pudo actualizar el salón');
  }
};


export const eliminarSalon = async (salonId) => {
  try {
    // Realizar la solicitud DELETE al endpoint
    const response = await axios.delete(`http://localhost:3000/salon/marcarD/${salonId}`, {
      params: { salonId }
    });

    if (response.status === 200) {
      console.log(response.data.message);
      return true;
    }
  } catch (error) {
    console.error('Error al eliminar el salón:', error);
    throw new Error('No se pudo eliminar el salón');
  }
};