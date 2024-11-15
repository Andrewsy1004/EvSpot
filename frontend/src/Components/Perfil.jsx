
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { FaCamera, FaUserCircle } from 'react-icons/fa';

import { getUser, fileUpload, updateUser } from '../helper';
import useAuthStore from '../Store/authStore';

import {Loader} from '../Admin/Components';

export const Perfil = () => {
  const userId = useAuthStore((state) => state.UserId);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    cc: '',
    correo: '',
    telefono: '',
    contrasena: '',
    rol: '',
    status: false,
    icono: '',
  });
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  // Validaciones para los campos
  const validateForm = () => {

    if (!formData.nombre || !formData.apellido || !formData.cc || !formData.correo || !formData.telefono || !formData.contrasena) {
      toast.error('Todos los campos son requeridos.');
      return false;
    }

    if (!formData.nombre.trim() || formData.nombre.length < 2) {
      toast.error('El nombre debe tener al menos 2 caracteres.');
      return false;
    }
    if (!formData.apellido.trim() || formData.apellido.length < 2) {
      toast.error('El apellido debe tener al menos 2 caracteres.');
      return false;
    }
    if (!/^\d{8,20}$/.test(formData.cc)) {
      toast.error('La cédula debe tener entre 8 y 20 dígitos.');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
      toast.error('El correo electrónico no es válido.');
      return false;
    }
    if (!/^\d{7,15}$/.test(formData.telefono)) {
      toast.error('El teléfono debe tener entre 7 y 15 dígitos.');
      return false;
    }
    if (formData.contrasena.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres.');
      return false;
    }
    

    return true;
  };

  // Obtener datos del usuario
  const fetchUser = async () => {
    try {
      const data = await getUser(userId);
      setFormData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener la información del usuario:', error);
      toast.error('No se pudo cargar la información del usuario.');
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Subir foto de perfil
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const uploadedUrl = await fileUpload(file);
      setFormData((prevState) => ({
        ...prevState,
        icono: uploadedUrl,
      }));
      toast.success('Imagen subida correctamente.');
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      toast.error('No se pudo subir la imagen.');
    } finally {
      setUploading(false);
    }
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await updateUser(userId, formData);
      toast.success('Usuario actualizado correctamente.');
    } catch (error) {
      console.error('Error al actualizar la información del usuario:', error);
      toast.error('No se pudo actualizar la información del usuario.');
    }
  };
 
   if(loading){
    return ( <Loader /> )
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-600 to-blue-400"></div>

        <div className="px-6 py-8 -mt-16">
          <div className="flex justify-center">
            <div className="relative group">
              {formData.icono ? (
                <img
                  src={formData.icono}
                  alt="Perfil"
                  className="h-32 w-32 rounded-full border-4 border-white shadow-lg object-cover"
                />
              ) : (
                <FaUserCircle className="h-32 w-32 text-gray-400 bg-white rounded-full" />
              )}
              <label
                htmlFor="fileUpload"
                className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full shadow-lg cursor-pointer transform transition-transform duration-200 hover:scale-110"
              >
                <FaCamera className="text-white w-4 h-4" />
              </label>
              <input
                id="fileUpload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              {uploading && (
                <div className="absolute inset-0 bg-white bg-opacity-75 rounded-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              )}
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center text-gray-800 mt-6 mb-8">
            Perfil de {formData.nombre.length > 10 ? `${formData.nombre.slice(0, 10)}...` : formData.nombre || 'Usuario'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Apellido</label>
                <input
                  type="text"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Cédula</label>
                <input
                  type="text"
                  name="cc"
                  value={formData.cc}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Correo</label>
                <input
                  type="email"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                <input
                  type="text"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              {/* <div>
                <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                <input
                  type="password"
                  name="contrasena"
                  value={formData.contrasena}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div> */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Rol</label>
                <input
                  type="text"
                  name="rol"
                  value={formData.rol}
                  disabled
                  className="w-full p-3 border rounded-md bg-gray-100 text-gray-500 shadow-sm cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Estado</label>
                <input
                  type="text"
                  name="status"
                  value={formData.status ? 'Activo' : 'Inactivo'}
                  disabled
                  className="w-full p-3 border rounded-md bg-gray-100 text-gray-500 shadow-sm cursor-not-allowed"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150"
            >
              Guardar Cambios
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
