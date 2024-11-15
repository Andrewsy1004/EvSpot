

import useAuthStore from './Store/authStore.js';

import { Landing } from "./router"
import { SalasRoute } from "./Salones";

import { AdminRouter } from './Admin/index.js';

export const App = () => {
  const isAuthenticated = useAuthStore((state) => state.Estado);
  const rol = useAuthStore((state) => state.Rol);
    
  if(isAuthenticated) {
        
    if(rol === 'Admin') {
      return <AdminRouter />
    }else{
      return <SalasRoute />
    }
      
  } else {
      return <Landing />
  }

}
