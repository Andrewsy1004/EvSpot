

import { useState, useEffect } from 'react';
import { FaCalendarAlt, FaSignOutAlt, FaPlusCircle, FaClipboardList } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

import { CrearReserva, obtenerFechaLocal, obtenerSalonesDisponibles } from '../helper/Salones';
import useAuthStore from '../../Store/authStore';

export const HacerReserva = () => {
  const [salones, setSalones] = useState([]);
  const [fecha_inicio, setFechaInicio] = useState('');
  const [fecha_final, setFechaFinal] = useState('');
  const [num_personas, setNumPersonas] = useState(1);
  const id_usuario = useAuthStore((state) => state.UserId); // Mantén este valor en el estado para la solicitud, pero sin mostrarlo
  const [id_salon, setIdSalon] = useState('');

  useEffect(() => {
    const fetchSalones = async () => {
      try {
        const salonesDisponibles = await obtenerSalonesDisponibles();
        setSalones(salonesDisponibles.salones);
      } catch (error) {
        console.error('Error al obtener los salones disponibles:', error);
      }
    };
    fetchSalones();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validaciones en el frontend
      if (!id_salon || !fecha_inicio || !fecha_final || !num_personas) {
        toast.error('Por favor, rellene todos los campos');
        return;
      }

      if(new Date(fecha_inicio) > new Date(fecha_final)){
        toast.error("La fecha final debe ser posterior a la fecha de inicio.");
        return;
      }

      // Llamar a la función para crear la reserva
      const reservaCreada = await CrearReserva(
        id_salon,
        id_usuario,
        fecha_inicio,
        fecha_final,
        num_personas
      );

      // Manejar respuesta del backend
      if (reservaCreada.success) {
        toast.success("Reserva creada correctamente");
        setFechaInicio('');
        setFechaFinal('');
        setNumPersonas(1);
        setIdSalon('');
      } else {
        // Mostrar mensaje de error devuelto por el backend
        toast.error(reservaCreada.message || 'Error al crear la reserva');
      }
    } catch (error) {
      console.error('Error al hacer la reserva:', error);

      // Mostrar mensaje basado en el error recibido del backend
      if (error.response) {
        const { message } = error.response.data;
        toast.error(message || 'Error desconocido al hacer la reserva');
      } else {
        toast.error('Error de conexión con el servidor');
      }
    }
  };

  return (
    <div className="flex justify-center items-center mt-7 ">
      <div className="w-full max-w-lg bg-white shadow-xl rounded-lg p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Hacer Reserva</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Selector de salón */}
          <div>
            <label className="flex items-center text-gray-600 mb-2">
              <FaClipboardList className="mr-2 text-indigo-500" />
              Salón
            </label>
            <select
              value={id_salon}
              onChange={(e) => setIdSalon(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"

            >
              <option value="">Seleccione un salón</option>
              {salones.map((salon) => (
                <option key={salon.salon_id} value={salon.salon_id}>
                  {salon.nombre_salon}
                </option>
              ))}
            </select>
          </div>

          {/* Fecha de inicio */}
          <div>
            <label className="flex items-center text-gray-600 mb-2">
              <FaCalendarAlt className="mr-2 text-indigo-500" />
              Fecha de inicio
            </label>
            <input
              type="datetime-local"
              value={fecha_inicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
             min={ obtenerFechaLocal() }
            />
          </div>

          {/* Fecha final */}
          <div>
            <label className="flex items-center text-gray-600 mb-2">
              <FaCalendarAlt className="mr-2 text-indigo-500" />
              Fecha final
            </label>
            <input
              type="datetime-local"
              value={fecha_final}
              onChange={(e) => setFechaFinal(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>

          {/* Número de personas */}
          <div>
            <label className="flex items-center text-gray-600 mb-2">
              <FaPlusCircle className="mr-2 text-indigo-500" />
              Número de personas
            </label>
            <input
              type="number"
              min="1"
              value={num_personas}
              onChange={(e) => setNumPersonas(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"

            />
          </div>

          {/* Botón de enviar */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition duration-300 flex items-center justify-center font-semibold"
          >
            <FaSignOutAlt className="mr-2" />
            Reservar
          </button>
        </form>
      </div>
    </div>
  );
};
