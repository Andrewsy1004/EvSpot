

import { useState } from 'react';
import { FaBuilding, FaRulerCombined, FaUsers, FaClock, FaImage, FaFileAlt } from 'react-icons/fa';
import { toast } from "react-hot-toast";

import useAuthStore from '../../Store/authStore';
import { fileUpload } from '../../helper';
import { CrearSalonEvento } from '../helpers';



export const CrearSalon = () => {
  const Id_Usuario = useAuthStore((state) => state.UserId);

  const [formData, setFormData] = useState({
    Nombre: '',
    Dimensiones_Area: '',
    Capacidad_Personas: '',
    Valor_Hora: '',
    Url_Image: '',
    Descripcion: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { Nombre, Dimensiones_Area, Capacidad_Personas, Valor_Hora, Url_Image, Descripcion } = formData;

    if (!Nombre || !Dimensiones_Area || !Capacidad_Personas || !Valor_Hora || !Url_Image || !Descripcion) {
      toast.error('Todos los campos son requeridos');
      return;
    }

    if (!Nombre || Nombre.length < 3) {
      toast.error('El nombre del salón debe tener al menos 3 caracteres.');
      return;
    }

    // Validación de la Descripción
    if (!Descripcion || Descripcion.length < 10) {
      toast.error('La descripción debe tener al menos 10 caracteres.');
      return;
    }

    // Validación de la URL de la Imagen
    const urlPattern = /^(http|https):\/\/[^ "]+$/;
    if (!Url_Image || !urlPattern.test(Url_Image)) {
      toast.error('Debe proporcionar una URL válida para la imagen.');
      return;
    }
    // Validación de Capacidad de Personas
    if (!Capacidad_Personas || isNaN(Capacidad_Personas) || Capacidad_Personas <= 0) {
      toast.error('La capacidad debe ser un número positivo.');
      return;
    }

    // Validación de Valor por Hora
    if (!Valor_Hora || isNaN(Valor_Hora) || parseFloat(Valor_Hora) <= 0) {
      toast.error('El valor por hora debe ser un número positivo con hasta dos decimales.');
      return;
    }


    const response = await CrearSalonEvento(Nombre, Dimensiones_Area, Capacidad_Personas, Valor_Hora, Url_Image, Descripcion, Id_Usuario);
    
    if (response.success) {
      toast.success(response.message);
      setFormData({
        Nombre: '',
        Dimensiones_Area: '',
        Capacidad_Personas: '',
        Valor_Hora: '',
        Url_Image: '',
        Descripcion: '',
      });
    } else {
      toast.error("Error al crear el salón");
    }
  };

  const onFileInputChange = async ({ target }) => {
    if (target.files.length === 0) return;
    const file = await fileUpload(target.files[0]);
    setFormData({ ...formData, Url_Image: file });
  };

  return (
    <div className=" flex items-center justify-center overflow-hidden ">
      <div className="max-w-2xl w-full bg-white p-10 rounded-xl shadow-xl animate__animated animate__fadeIn mx-4 overflow-hidden">
        <h1 className="text-4xl font-bold mb-8 text-center text-blue-600 border-b-2 border-blue-500 pb-4">
          Crear Salón de Eventos
        </h1>

        <form onSubmit={handleSubmit} className="space-y-1">
          <div>
            <label htmlFor="Nombre" className="flex items-center text-base font-medium mb-2 text-gray-700">
              <FaBuilding className="mr-2 text-blue-500" />
              Nombre del Salón:
            </label>
            <input
              type="text"
              id="Nombre"
              name="Nombre"
              value={formData.Nombre}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            />
          </div>

          <div>
            <label htmlFor="Dimensiones_Area" className="flex items-center text-base font-medium mb-2 text-gray-700">
              <FaRulerCombined className="mr-2 text-blue-500" />
              Dimensiones del Área:
            </label>
            <input
              type="text"
              id="Dimensiones_Area"
              name="Dimensiones_Area"
              value={formData.Dimensiones_Area}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            />
          </div>

          <div>
            <label htmlFor="Capacidad_Personas" className="flex items-center text-base font-medium mb-2 text-gray-700">
              <FaUsers className="mr-2 text-blue-500" />
              Capacidad de Personas:
            </label>
            <input
              type="number"
              id="Capacidad_Personas"
              name="Capacidad_Personas"
              value={formData.Capacidad_Personas}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            />
          </div>

          <div>
            <label htmlFor="Valor_Hora" className="flex items-center text-base font-medium mb-2 text-gray-700">
              <FaClock className="mr-2 text-blue-500" />
              Valor por Hora:
            </label>
            <input
              type="number"
              id="Valor_Hora"
              name="Valor_Hora"
              value={formData.Valor_Hora}
              onChange={handleChange}
              step="0.01"
              className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            />
          </div>

          <div>
            <label htmlFor="Url_Image" className="flex items-center text-base font-medium mb-2 text-gray-700">
              <FaImage className="mr-2 text-blue-500" />
              Imagen del Salón:
            </label>
            <input
              type="file"
              id="Url_Image"
              name="Url_Image"
              onChange={onFileInputChange}
              accept="image/*"
              className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          <div>
            <label htmlFor="Descripcion" className="flex items-center text-base font-medium mb-2 text-gray-700">
              <FaFileAlt className="mr-2 text-blue-500" />
              Descripción:
            </label>
            <textarea
              id="Descripcion"
              name="Descripcion"
              value={formData.Descripcion}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-6 mt-6 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-lg transition duration-200 shadow-md hover:shadow-lg"
          >
            Crear Salón de Eventos
          </button>
        </form>
      </div>
    </div>
  );
};
