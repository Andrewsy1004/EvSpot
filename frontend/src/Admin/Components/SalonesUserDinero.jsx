import React, { useState } from "react";

export const SalonesUserDinero = ({ SalonesUsuario }) => {
    // Estado para almacenar el salón seleccionado
    const [salonSeleccionado, setSalonSeleccionado] = useState("");

    return (
        <div className="space-y-6">
            {/* Pestañas para seleccionar salones */}
            <div className="flex justify-center space-x-4 mb-6 overflow-x-auto">
                <button
                    className={`px-4 py-2 rounded-lg ${
                        salonSeleccionado === ""
                            ? "bg-indigo-500 text-white"
                            : "bg-gray-200 text-gray-800"
                    } hover:bg-indigo-400 transition`}
                    onClick={() => setSalonSeleccionado("")}
                >
                    Todos los salones
                </button>
                {SalonesUsuario.map((salon) => (
                    <button
                        key={salon.nombre_salon}
                        className={`px-4 py-2 rounded-lg ${
                            salonSeleccionado === salon.nombre_salon
                                ? "bg-indigo-500 text-white"
                                : "bg-gray-200 text-gray-800"
                        } hover:bg-indigo-400 transition`}
                        onClick={() => setSalonSeleccionado(salon.nombre_salon)}
                    >
                        {salon.nombre_salon}
                    </button>
                ))}
            </div>

            {/* Mostrar información */}
            {SalonesUsuario.filter(
                (salon) =>
                    !salonSeleccionado || salon.nombre_salon === salonSeleccionado
            ).map((salon) => (
                <div
                    key={salon.nombre_salon}
                    className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow"
                >
                    <h3 className="text-xl font-bold text-gray-800 mb-4">
                        {salon.nombre_salon}
                    </h3>
                    <div className="space-y-4">
                        {salon.reservas.map((reserva, index) => (
                            <div
                                key={`${reserva.cliente}-${index}`}
                                className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border"
                            >
                                <div>
                                    <h4 className="text-gray-800 font-medium">
                                        {reserva.cliente}
                                    </h4>
                                    <span className="text-gray-500 text-sm">
                                        Fecha: {new Date(reserva.fecha).toLocaleDateString()}
                                    </span>
                                </div>
                                <span className="text-lg font-bold text-indigo-600">
                                    ${parseFloat(reserva.total).toFixed(2)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};
