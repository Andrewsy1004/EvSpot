

import { useEffect, useState } from "react";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import useAuthStore from '../../Store/authStore.js';

import { obtenerEstadisticasPorSalon, obtenerEstadisticasUserSalon } from "../helpers/Estadisticas.js";
import { ReservaCard, SalonesUserDinero } from "../Components";
import { Loader } from "../Components/Loader.jsx";


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const Reservas = () => {
  const [activeTab, setActiveTab] = useState("resumen"); // Tab activo
  const [salones, setSalones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [SalonesUsuario, setSalonesUsuario] = useState([]);

  const Id_Usuario = useAuthStore((state) => state.UserId);


  const getData = async () => {
    const data = await obtenerEstadisticasPorSalon(Id_Usuario);

    console.log(data);

    setSalones(data);
    setIsLoading(false);
  };

  const getDataUsuario = async () => {
    const data = await obtenerEstadisticasUserSalon(Id_Usuario);
    setSalonesUsuario(data);
    setIsLoading(false);
  };

  useEffect(() => {
    getData();
    getDataUsuario();
  }, []);

  // Configuración de los datos del gráfico
  const chartData = {
    labels: salones.map((salon) => salon.nombre_salon), // Nombres de los salones
    datasets: [
      {
        label: "Dinero Generado ($)",
        data: salones.map((salon) =>
          salon.total_generado ? parseFloat(Number(salon.total_generado).toFixed(2)) : 0
        ), // Dinero generado
        backgroundColor: "rgba(75, 192, 192, 0.6)", // Color de las barras
        borderColor: "rgba(75, 192, 192, 1)", // Color del borde
        borderWidth: 1,
      },
      {
        label: "Reservas Totales",
        data: salones.map((salon) => salon.cantidad_reservas || 0), // Número de reservas
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Configuración de las opciones del gráfico
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Dinero Generado y Reservas por Salón",
      },
    },
  };

  if (isLoading) return (<Loader />)

  return (
    <div className="p-6  min-h-screen">
      {/* Título */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Panel de Reservas
      </h1>

      {/* Filtros / Tabs */}
      <div className="flex justify-center space-x-4 mb-6">
        <button
          onClick={() => setActiveTab("resumen")}
          className={`px-4 py-2 rounded-lg ${activeTab === "resumen"
            ? "bg-indigo-500 text-white"
            : "bg-gray-200 text-gray-800"
            } hover:bg-indigo-400`}
        >
          Resumen
        </button>
        <button
          onClick={() => setActiveTab("detalles")}
          className={`px-4 py-2 rounded-lg ${activeTab === "detalles"
            ? "bg-indigo-500 text-white"
            : "bg-gray-200 text-gray-800"
            } hover:bg-indigo-400`}
        >
          Detalles de Reservas
        </button>
        <button
          onClick={() => setActiveTab("grafica")}
          className={`px-4 py-2 rounded-lg ${activeTab === "grafica"
            ? "bg-indigo-500 text-white"
            : "bg-gray-200 text-gray-800"
            } hover:bg-indigo-400`}
        >
          Gráfica
        </button>
      </div>

      {/* Contenido dinámico */}
      <div>
        {activeTab === "resumen" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ReservaCard salones={salones} />
          </div>
        )}

        {activeTab === "detalles" && (
          <div className="space-y-6">
            <SalonesUserDinero SalonesUsuario={SalonesUsuario} />
          </div>
        )}

        {activeTab === "grafica" && (
          <div className="bg-white shadow-lg rounded-lg p-6">
            <Bar data={chartData} options={chartOptions} />
          </div>
        )}
      </div>
    </div>
  );
};
