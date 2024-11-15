

import { Route, Routes, Navigate } from "react-router-dom"

import { NavBarAdmin } from "../Components"
import { Perfil } from "../../Components"
import { CrearSalon, SalonesAdmin, Salon, Reservas } from "../pages"

export const AdminRouter = () => {
  return (
    <>
      <NavBarAdmin />
      <div className="w-full container mx-auto">
        <Routes>
          <Route path="/" element={<SalonesAdmin />} />

          <Route path="/crearSalon" element={<CrearSalon />} />
          <Route path="/:salonId" element={<Salon />} />

          <Route path="/perfil" element={<Perfil />} />

          <Route path="/misReservas" element={<Reservas />} />

          <Route path="/login" element={<Navigate to="/" replace />} />


        </Routes>
      </div>
    </>
  )
}
