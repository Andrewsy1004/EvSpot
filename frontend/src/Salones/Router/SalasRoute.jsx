

import { Routes, Route, Navigate } from "react-router-dom"

import { NavbarSalones } from "../Components"
import { Perfil } from "../../Components"

import { HacerReserva, MisReservas } from "../pages"
import { Salones } from "../pages/Salones"
import { Salon } from "../../Admin/pages"

export const SalasRoute = () => {
  return (
    <>
      <NavbarSalones />
      <div className="container">
        <Routes>

          <Route path="/" element={<Salones />} />
          <Route path="/reserva" element={<HacerReserva />} />
          <Route path="/:salonId" element={<Salon />} />

          <Route path="/misReservas" element={<MisReservas />} />

          <Route path="/perfil" element={<Perfil />} />

          <Route path="/login" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  )
}
