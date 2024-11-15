

import { useState } from 'react';
import toast from "react-hot-toast";

import { IniciarSesion } from '../Helpers';

import "../css/IniciarSesion_Registro.css";


export const SignInForm = () => {
  
  const [state, setState] = useState({
    Correo:    "",
    Contrasena: ""
  });

  const handleChange = (evt) => {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value
    });
  };

  const handleOnSubmit =  async (evt) => {
    evt.preventDefault();

    const { Correo, Contrasena } = state;
    
    if (!Correo && !Contrasena) {
      toast.error('Todos los campos son requeridos');
      return;
    }

    if (!Correo) {
      toast.error('El correo es requerido');
      return;
    }

    if (!Correo.includes('@')) {
      toast.error('El correo no es válido');
      return;
    }

    if (!Contrasena) {
      toast.error('La contraseña es requerida');
      return;
    }

    const result = await IniciarSesion(Correo, Contrasena);

    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
    
  };

  return (
    <div className="form-container sign-in-container Auth">
      <form onSubmit={handleOnSubmit}>
        <h1>Iniciar Sesión</h1>

        <input
          type="email"
          placeholder="Correo"
          name="Correo"
          value={state.Correo}
          onChange={handleChange}
        />
        <input
          type="password"
          name="Contrasena"
          placeholder="Contraseña"
          value={state.Contrasena}
          onChange={handleChange}
        />
        
        <button type="submit">
          Iniciar Sesion
        </button>
      
      </form>
    </div>
  );
}

