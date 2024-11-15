
import React from "react";
import { FaSyncAlt, FaTrashAlt, FaFileInvoice } from "react-icons/fa";

export const ReservasUsu = ({
    reservas,
    formatDate,
    abrirModal,
    eliminarReserva,
    abrirModalFactura,
}) => {
    return (
        <>
            {reservas
                .slice()
                .sort((a, b) => {
                    // Obtener la fecha y hora actuales
                    const ahora = new Date().getTime();

                    // Verificar si las reservas ya pasaron
                    const inicioA = new Date(a.fecha_inicio).getTime();
                    const inicioB = new Date(b.fecha_inicio).getTime();

                    const pasadaA = inicioA < ahora ? -1 : 1; // Reservas pasadas primero
                    const pasadaB = inicioB < ahora ? -1 : 1;

                    if (pasadaA !== pasadaB)  return pasadaA - pasadaB; 
                    
                    // Si ambas reservas son pasadas o ambas son futuras, ordenar por duración
                    const duracionA =
                        (new Date(a.fecha_final) - new Date(a.fecha_inicio)) / 60000;
                    const duracionB =
                        (new Date(b.fecha_final) - new Date(b.fecha_inicio)) / 60000;

                    if (duracionA !== duracionB) {
                        return duracionA - duracionB; // Orden ascendente por duración
                    }

                    // Si la duración es igual, ordenar por fecha de inicio
                    return inicioA - inicioB; // Orden ascendente por fecha de inicio
                })
                .map((reserva) => (
                    <div
                        key={reserva.id_reserva}
                        className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                    >
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4">
                            <h2 className="text-xl font-bold text-white truncate">
                                {reserva.nombre_salon}
                            </h2>
                        </div>

                        <div className="p-6">
                            <div className="space-y-3 mb-6">
                                <div className="flex items-center text-gray-700">
                                    <span className="font-semibold w-24">Inicio:</span>
                                    <span>{formatDate(reserva.fecha_inicio)}</span>
                                </div>
                                <div className="flex items-center text-gray-700">
                                    <span className="font-semibold w-24">Final:</span>
                                    <span>{formatDate(reserva.fecha_final)}</span>
                                </div>
                                <div className="flex items-center text-gray-700">
                                    <span className="font-semibold w-24">Personas:</span>
                                    <span>{reserva.num_personas}</span>
                                </div>
                            </div>

                            <div className="flex flex-col space-y-2">
                                {/* Mostrar botones de acción */}
                                {new Date() <= new Date(reserva.fecha_inicio) && (
                                    <>
                                        <button
                                            onClick={() => abrirModal(reserva)}
                                            className="w-full inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                                        >
                                            <FaSyncAlt className="mr-2" />
                                            <span>Actualizar</span>
                                        </button>

                                        <button
                                            onClick={() => eliminarReserva(reserva.id_reserva)}
                                            className="w-full inline-flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                                        >
                                            <FaTrashAlt className="mr-2" />
                                            <span>Eliminar</span>
                                        </button>
                                    </>
                                )}

                                {/* Botón de Ver Factura */}
                                <button
                                    onClick={() => abrirModalFactura(reserva)}
                                    className="w-full inline-flex items-center justify-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200"
                                >
                                    <FaFileInvoice className="mr-2" />
                                    <span>Ver Factura</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
        </>
    );
};

