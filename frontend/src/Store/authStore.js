
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set) => ({
      UserId: null,
      Correo: null,
      Estado: null,
      Nombre: null,
      Rol: null,
      Icono: null,

      login: (UserId, Correo, Nombre, Rol, icono) => set({
        UserId: UserId,
        Correo: Correo,
        Nombre: Nombre,
        Estado: true,
        Rol: Rol,
        Icono: icono
      }),

      logout: () => set({
        UserId: null,
        Correo: null,
        Nombre: null,
        Estado: false,
        Rol: null,
        Icono: null
      }),

      actualizarInfo: (Nombre, Icono) => set((state) => ({
          Nombre: Nombre,
          Icono: Icono || state.Icono, // Si Icono está definido, actualiza; si no, conserva el estado anterior
      })),


    }),


    {
      name: 'EvSpot-Auth',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

export default useAuthStore;