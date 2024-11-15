

import { useState } from 'react';
import { toast } from "react-hot-toast";
import { RegistrarUsuario } from '../Helpers';

export const SignUpForm = () => {

  const [state, setState] = useState({
    Nombre: "",
    Apellido: "",
    Cc: "",
    Telefono: "",
    Correo: "",
    Contrasena: ""
  });


  const handleChange = evt => {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value
    });
  };

  const handleOnSubmit = async (evt) => {
    evt.preventDefault();
    const { Nombre, Apellido, Cc, Telefono, Correo, Contrasena } = state;
  
    // Validación de campos requeridos
    if (!Nombre || !Apellido || !Cc || !Telefono || !Correo || !Contrasena) {
      toast.error('Todos los campos son requeridos');
      return;
    }
  
    // Validación de longitud de caracteres
    if (Nombre.length > 50) {
      toast.error('El nombre no puede exceder los 50 caracteres');
      return;
    }
  
    if (Apellido.length > 50) {
      toast.error('El apellido no puede exceder los 50 caracteres');
      return;
    }
  
    if (Cc.length > 20) {
      toast.error('La cédula no puede exceder los 20 caracteres');
      return;
    }
  
    if (Correo.length > 20) {
      toast.error('El correo no puede exceder los 20 caracteres');
      return;
    }
  
    if (Telefono.length > 20) {
      toast.error('El teléfono no puede exceder los 20 caracteres');
      return;
    }
  
    if (Contrasena.length > 20) {
      toast.error('La contraseña no puede exceder los 20 caracteres');
      return;
    }
  
    // Validación de formato de correo
    if (!Correo.includes('@')) {
      toast.error('El correo no es válido');
      return;
    }
  
    // Llamada a la función de registro
    const result = await RegistrarUsuario(Nombre, Apellido, Cc, Telefono, Correo, Contrasena);
  
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };
  

  return (
    <div className="form-container sign-up-container Auth" >
      <form onSubmit={handleOnSubmit}>
        <h1>Registrarse</h1>

        <input
          type="text"
          name="Nombre"
          value={state.Nombre}
          onChange={handleChange}
          placeholder="Nombre"
        />
        <input
          type="text"
          name="Apellido"
          value={state.Apellido}
          onChange={handleChange}
          placeholder="Apellido"
        />
        <input
          type="text"
          name="Cc"
          value={state.Cc}
          onChange={handleChange}
          placeholder="Número de identificación"
        />
        <input
          type="text"
          name="Telefono"
          value={state.Telefono}
          onChange={handleChange}
          placeholder="Teléfono"
        />
        <input
          type="email"
          name="Correo"
          value={state.Correo}
          onChange={handleChange}
          placeholder="Correo"
        />
        <input
          type="password"
          name="Contrasena"
          value={state.Contrasena}
          onChange={handleChange}
          placeholder="Contraseña"
        />



        <button type='submit'>Registrarse</button>
      </form>
    </div>
  );
}

