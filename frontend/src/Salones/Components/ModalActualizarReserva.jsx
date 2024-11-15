import { obtenerFechaLocal } from "../helper";



export const ModalActualizarReserva = ({
  selectedReserva,
  setSelectedReserva,
  onClose,
  onSave,
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-indigo-50 rounded-lg p-4 mb-6">
        <p className="text-indigo-900 font-medium">{selectedReserva.nombre_salon}</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha Inicio
          </label>
          <input
            type="datetime-local"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-0 focus:border-black transition-colors"
            value={new Date(selectedReserva.fecha_inicio).toISOString().slice(0, 16)}
            min={ obtenerFechaLocal() } // Valor mínimo (fecha y hora actual)
            onChange={(e) =>
              setSelectedReserva({ ...selectedReserva, fecha_inicio: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha Final
          </label>
          <input
            type="datetime-local"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-0 focus:border-black transition-colors"
            value={new Date(selectedReserva.fecha_final).toISOString().slice(0, 16)}
            min={new Date().toISOString().slice(0, 16)} // Valor mínimo (fecha y hora actual)
            onChange={(e) =>
              setSelectedReserva({ ...selectedReserva, fecha_final: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Número de Personas
          </label>
          <input
            type="number"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-0 focus:border-black transition-colors"
            value={selectedReserva.num_personas}
            onChange={(e) =>
              setSelectedReserva({ ...selectedReserva, num_personas: e.target.value })
            }
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 mt-8">
        <button
          onClick={onClose}
          className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={onSave}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Guardar Cambios
        </button>
      </div>
    </div>
  );
};

