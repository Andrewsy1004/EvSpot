export const SalonUpdateModal = ({
    updateData,
    handleUpdateChange,
    onFileInputChange,
    handleUpdateSubmit,
    setShowModal,
}) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
            <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-2xl transform transition-all duration-300 ease-in-out">
                <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Actualizar Salón</h3>
                <form>
                    <div className="mb-5">
                        <label htmlFor="nombre_salon" className="block text-sm font-medium text-gray-700 mb-1">
                            Nombre del Salón
                        </label>
                        <input
                            type="text"
                            id="nombre_salon"
                            name="nombre_salon"
                            value={updateData.nombre_salon || ''}
                            onChange={handleUpdateChange}
                            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="dimensiones_area" className="block text-sm font-medium text-gray-700 mb-1">
                            Dimensiones
                        </label>
                        <input
                            type="text"
                            id="dimensiones_area"
                            name="dimensiones_area"
                            value={updateData.dimensiones_area || ''}
                            onChange={handleUpdateChange}
                            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="capacidad" className="block text-sm font-medium text-gray-700 mb-1">
                            Capacidad
                        </label>
                        <input
                            type="number"
                            id="capacidad"
                            name="capacidad"
                            value={updateData.capacidad || ''}
                            onChange={handleUpdateChange}
                            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="valor_hora" className="block text-sm font-medium text-gray-700 mb-1">
                            Valor por Hora
                        </label>
                        <input
                            type="number"
                            id="valor_hora"
                            name="valor_hora"
                            value={updateData.valor_hora || ''}
                            onChange={handleUpdateChange}
                            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="imagen_salon" className="block text-sm font-medium text-gray-700 mb-1">
                            Imagen del Salón
                        </label>
                        <input
                            type="file"
                            id="imagen_salon"
                            onChange={onFileInputChange}
                            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        />
                    </div>
                    <div className="flex justify-end mt-8 space-x-3">
                        <button
                            type="button"
                            className="px-5 py-2 rounded-lg text-sm font-semibold bg-gray-400 text-white hover:bg-gray-500 transition duration-200 focus:outline-none"
                            onClick={() => setShowModal(false)}
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            className="px-5 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onClick={handleUpdateSubmit}
                        >
                            Guardar Cambios
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
