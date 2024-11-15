

import { FaClipboardList, FaMoneyBillWave } from "react-icons/fa";

export const ReservaCard = ({ salones }) => {
  return (
    <>
      {salones.map((salon) => (
        <div
          key={salon.nombre_salon}
          className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow"
        >
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            {salon.nombre_salon}
          </h2>
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center text-gray-600">
              <FaClipboardList className="mr-2 text-indigo-500" />
              Reservas
            </span>
            <span className="text-xl font-bold text-indigo-600">
              {salon.cantidad_reservas}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center text-gray-600">
              <FaMoneyBillWave className="mr-2 text-green-500" />
              Total Generado
            </span>
            <span className="text-xl font-bold text-green-600">
              ${salon.total_generado ? parseFloat(Number(salon.total_generado).toFixed(2)) : "0.00"}
            </span>

          </div>
        </div>
      ))}

    </>
  )
}
