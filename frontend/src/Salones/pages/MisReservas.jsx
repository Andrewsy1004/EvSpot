
import { useState, useEffect } from "react";
import { obtenerReservasPorUsuario, eliminarReservaporId, ActualizarReserva } from "../helper";
import { FaFileInvoice } from "react-icons/fa";

import useAuthStore from "../../Store/authStore";

import { Loader } from "../../Admin/Components";
import { FacturaModal, ModalActualizarReserva, ReservasUsu } from "../Components";

import { toast } from "react-hot-toast";

export const MisReservas = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReserva, setSelectedReserva] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalFacturaOpen, setModalFacturaOpen] = useState(false);

  const idUsuario = useAuthStore((state) => state.UserId);

  // Formatear fechas de manera personalizada
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Intl.DateTimeFormat("es-ES", options).format(new Date(dateString));
  };

  const cargarReservas = async () => {
    setLoading(true);
    try {
      const data = await obtenerReservasPorUsuario(idUsuario);
      setReservas(data);
    } catch (error) {
      console.error("Error al cargar reservas:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const eliminarReserva = async (idReserva) => {
    try {
      const response = await eliminarReservaporId(idReserva);

      if (response.success) {
        toast.success("Reserva eliminada correctamente");

        // Actualizar el estado local eliminando la reserva por su ID
        setReservas((prevReservas) => prevReservas.filter((r) => r.id_reserva !== idReserva));

      }
    } catch (error) {
      console.error("Error al eliminar la reserva:", error.message);
      toast.error("Hubo un problema al eliminar la reserva.");
    }
  };

  const abrirModal = (reserva) => {
    setSelectedReserva(reserva);
    setModalOpen(true);
  };

  const abrirModalFactura = (reserva) => {
    setSelectedReserva(reserva);
    setModalFacturaOpen(true);
  };

  const cerrarModal = () => {
    setSelectedReserva(null);
    setModalOpen(false);
  };

  const cerrarModalFactura = () => {
    setSelectedReserva(null);
    setModalFacturaOpen(false);
  };

  const actualizarReserva = async () => {

    if (selectedReserva.fecha_inicio > selectedReserva.fecha_final) {
      toast.error("La fecha final debe ser posterior a la fecha de inicio.");
      return;
    }

    const reservaActualizada = await ActualizarReserva(selectedReserva.id_reserva, selectedReserva);

    if (reservaActualizada.success) {
      toast.success("Reserva actualizada correctamente");
      cargarReservas();
    }

    cerrarModal();
  };

  useEffect(() => {
    cargarReservas();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-indigo-900 mb-2">Mis Reservas</h1>
          <p className="text-gray-600">Gestiona tus reservas de salones</p>
        </div>

        {loading ? (
          <Loader />
        ) : reservas.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="mb-4">
              <div className="mx-auto h-24 w-24 bg-indigo-100 rounded-full flex items-center justify-center">
                <FaFileInvoice className="h-12 w-12 text-indigo-500" />
              </div>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">Sin Reservas</h3>
            <p className="text-gray-500">No tienes reservas registradas en este momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ReservasUsu
              reservas={reservas}
              formatDate={formatDate}
              abrirModal={abrirModal}
              eliminarReserva={eliminarReserva}
              abrirModalFactura={abrirModalFactura}
            />

          </div>
        )}

        {/* Modal Actualizar Reserva */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 transform transition-all duration-300">
              <div className="absolute top-4 right-4">
                <button
                  onClick={cerrarModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
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

              <h2 className="text-2xl font-bold text-gray-900 mb-6">Actualizar Reserva</h2>

              {selectedReserva && (
                <ModalActualizarReserva
                  selectedReserva={selectedReserva}
                  setSelectedReserva={setSelectedReserva}
                  onClose={cerrarModal}
                  onSave={actualizarReserva}
                />
              )}
            </div>
          </div>
        )}

        {/* Modal Factura */}
        {modalFacturaOpen && selectedReserva && (
          <FacturaModal
            isOpen={modalFacturaOpen}
            reserva={selectedReserva}
            onClose={cerrarModalFactura}
          />
        )}
      </div>
    </div>
  );
};

