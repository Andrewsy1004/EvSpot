
import { FaFileInvoice } from "react-icons/fa";

export const FacturaModal = ({ isOpen, reserva, onClose }) => {
    if (!isOpen || !reserva) return null; 

    const duracionHoras = Math.ceil(
        (new Date(reserva.fecha_final) - new Date(reserva.fecha_inicio)) /
        (1000 * 60 * 60)
    );
    const costoTotal = duracionHoras * reserva.valor_hora;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 transform transition-all duration-300">
                {/* Botón de Cerrar */}
                <div className="absolute top-4 right-4">
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors hover:scale-110"
                    >
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                {/* Encabezado del Modal */}
                <div className="text-center mb-6">
                    <div className="mx-auto h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                        <FaFileInvoice className="h-8 w-8 text-emerald-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Detalles de la Factura</h2>
                </div>

                {/* Contenido de la Factura */}
                <div className="bg-gray-50 rounded-xl p-9 space-y-4">
                    <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                        <span className="font-medium text-gray-600">Factura ID:</span>
                        <span className="text-gray-900">FACT-{reserva.id_reserva}</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                        <span className="font-medium text-gray-600">Salón:</span>
                        <span className="text-gray-900">{reserva.nombre_salon}</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                        <span className="font-medium text-gray-600">Duración:</span>
                        <span className="text-gray-900">{duracionHoras} horas</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                        <span className="font-medium text-gray-600">Valor por hora:</span>
                        <span className="text-gray-900">${reserva.valor_hora}</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                        <span className="font-medium text-gray-600">Costo Total:</span>
                        <span className="text-2xl font-bold text-emerald-600">
                            ${costoTotal.toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

