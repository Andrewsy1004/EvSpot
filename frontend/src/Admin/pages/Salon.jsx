

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { FaTrashAlt, FaSyncAlt, FaStar } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

import { getSalonById, actualizarSalon, submitComentario, getComentariosBySalon, eliminarComentario, eliminarSalon } from '../helpers';
import { fileUpload } from '../../helper';

import { Loader, SalonUpdateModal } from '../Components';
import useAuthStore from '../../Store/authStore';

export const Salon = () => {
  const { salonId } = useParams();
  const [salon, setSalon] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [updateData, setUpdateData] = useState({});
  const [file, setFile] = useState(null);

  const [modalComentarios, setModalComentarios] = useState(false);
  const [comentario, setComentario] = useState('');
  const [calificacion, setCalificacion] = useState(0);
  const [hover, setHover] = useState(0);
  const [comentarios, setComentarios] = useState([]);

  const rol = useAuthStore((state) => state.Rol);
  const iduser = useAuthStore((state) => state.UserId);

  const navigate = useNavigate();

  const fetchSalon = async () => {
    try {
      const data = await getSalonById(salonId);
      setSalon(data);
      setUpdateData(data);
    } catch (error) {
      console.error('Error al obtener los detalles del salón:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchComentarios = async () => {
    try {
      const data = await getComentariosBySalon(salonId);
      setComentarios(data.comentarios); // Asegúrate de que 'data.comentarios' exista
    } catch (error) {
      console.error('Error al obtener los comentarios:', error);
    }
  };

  useEffect(() => {
    if (salonId) {
      fetchSalon();
      fetchComentarios();
    }
  }, [salonId]);


  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdateData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdateSubmit = async () => {
    try {
      let imageUrl = updateData.url_imagen;
      if (file) {
        imageUrl = await fileUpload(file);
      }
      await actualizarSalon(salonId, { ...updateData, url_imagen: imageUrl });
      setShowModal(false);
      fetchSalon();
      toast.success('Salón actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar el salón:', error);
    }
  };

  const onFileInputChange = ({ target }) => {
    if (target.files.length === 0) return;
    setFile(target.files[0]);
  };

  const handleComentarioSubmit = async () => {
    if (!comentario || !calificacion) {
      toast.error('Todos los campos son requeridos');
      return;
    }

    const success = await submitComentario(iduser, salonId, comentario, calificacion);

    if (success) {
      setComentario('');
      setCalificacion(0);
      fetchComentarios(); // Actualiza los comentarios después de agregar uno nuevo
    }
    setModalComentarios(false); // Cierra el modal después de agregar el comentario
  };

  const handleEliminarComentario = async (comentarioId) => {
    try {
      await eliminarComentario(comentarioId);
      toast.success('Comentario eliminado con éxito');
      fetchComentarios(); // Actualiza la lista de comentarios después de eliminar
    } catch (error) {
      console.error('Error al eliminar el comentario:', error);
    }
  };

  const elimarSalon = async () => {
    try {

      const success = await eliminarSalon(salonId);
     
      if (success) {
        toast.success('Salón eliminado correctamente');
        navigate('/');
        return;
      }

    } catch (error) {
      console.error('Error al eliminar el salón:', error);
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="container mx-auto py-10 px-5">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden mb-10">
        <img src={salon.url_imagen} alt={salon.nombre_salon} className="w-full h-64 object-cover" />
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-gray-800">{salon.nombre_salon}</h2>
          <p className="text-gray-600 mt-2"><strong>Descripción:</strong> {salon.descripcion}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="flex items-center">
              <i className="bi bi-arrows-angle-expand text-blue-500 mr-2"></i>
              <span><strong>Dimensiones:</strong> {salon.dimensiones_area}</span>
            </div>
            <div className="flex items-center">
              <i className="bi bi-people text-blue-500 mr-2"></i>
              <span><strong>Capacidad:</strong> {salon.capacidad} personas</span>
            </div>
            <div className="flex items-center">
              <i className="bi bi-cash text-blue-500 mr-2"></i>
              <span><strong>Valor por hora:</strong> ${salon.valor_hora}</span>
            </div>
          </div>
        </div>

        {rol === 'Admin' && (
          <div className="flex space-x-4 mt-4">
            <button
              className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
              onClick={elimarSalon}
            >
              <FaTrashAlt className="mr-2" /> Eliminar
            </button>
            <button
              className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
              onClick={() => setShowModal(true)}
            >
              <FaSyncAlt className="mr-2" /> Actualizar
            </button>
          </div>
        )}

        {rol === 'Usuario' && (
          <button
            className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 mt-4"
            onClick={() => setModalComentarios(true)}
          >
            Agregar Comentario
          </button>
        )}

      </div>

      {showModal && (
        <SalonUpdateModal
          updateData={updateData}
          handleUpdateChange={handleUpdateChange}
          onFileInputChange={onFileInputChange}
          handleUpdateSubmit={handleUpdateSubmit}
          setShowModal={setShowModal}
        />
      )}

      {modalComentarios && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Calificar y Comentar</h3>

            <div className="flex justify-center mb-4">
              {[1, 2, 3, 4, 5].map((index) => (
                <FaStar
                  key={index}
                  size={30}
                  onClick={() => setCalificacion(index)}
                  onMouseEnter={() => setHover(index)}
                  onMouseLeave={() => setHover(calificacion)}
                  className={index <= (hover || calificacion) ? "text-yellow-500 cursor-pointer" : "text-gray-300 cursor-pointer"}
                />
              ))}
            </div>

            <textarea
              className="w-full border border-gray-300 p-2 rounded-lg mb-4"
              rows="4"
              placeholder="Escribe tu comentario aquí..."
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
            />

            <div className="flex justify-end">
              <button
                onClick={() => setModalComentarios(false)}
                className="bg-gray-400 text-white py-2 px-4 rounded-lg mr-2"
              >
                Cancelar
              </button>
              <button
                onClick={handleComentarioSubmit}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
              >
                Enviar Comentario
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6">
        <h3 className="text-xl font-semibold text-gray-800 text-center mb-4">Comentarios:</h3>
        <div className="flex flex-col items-center">
          {comentarios.length > 0 ? (
            comentarios.map((c) => (
              <div key={c.id_comentario} className="flex flex-col border-b py-4 px-4 bg-white rounded-lg shadow-md mb-4 max-w-4xl w-full">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className="flex">
                      {[...Array(5)].map((_, starIndex) => (
                        <FaStar key={starIndex} size={20} className={starIndex < c.calificacion ? "text-yellow-500" : "text-gray-300"} />
                      ))}
                    </div>
                    <div className="ml-3">
                      <span className="font-semibold text-gray-600">{c.nombre_usuario}</span>
                      <p className="text-gray-400 text-sm">{new Date(c.fecha_calificacion).toLocaleString()}</p>
                    </div>
                  </div>
                  {c.id_usuario === iduser && (
                    <button onClick={() => handleEliminarComentario(c.id_comentario)} className="text-red-500 hover:text-red-700 transition duration-300">
                      <FaTrashAlt />
                    </button>
                  )}
                </div>
                <p className="text-gray-700">{c.comentario}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">No hay comentarios disponibles.</p>
          )}
        </div>
      </div>




    </div>
  );
};
