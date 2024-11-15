
import { useState } from "react";
import { SignUpForm, SignInForm } from "../pages";
 
export const  HandlerAuth = () => {
  const [type, setType] = useState("signIn");
  const containerClass = "container " + (type === "signUp" ? "right-panel-active" : "");
  
  const handleOnClick = text => {
    if (text !== type) {
      setType(text);
      return;
    }
  };
  
  return (
    <div className="App Auth">
     
      <div className={containerClass} id="container" style={{ height: "92vh", width: "65vw" }}>
        <SignUpForm />  
        <SignInForm />
        <div className="overlay-container">
          <div className="overlay">

            <div className="overlay-panel overlay-left">
              <h1>Bienvenido!</h1>
              <p>Para mantenerte en contacto con nosotros, inicia sesión con tus datos personales</p>
              <button
                className="ghost"
                id="signIn"
                onClick={() => handleOnClick("signIn")}
              >
                Iniciar Sesión
              </button>
            </div>
            
            <div className="overlay-panel overlay-right">
              <h1>Hola, Amigo!</h1>
              <p>Introduzca sus datos personales y empiece a viajar con nosotros</p>
              <button
                className="ghost "
                id="signUp"
                onClick={() => handleOnClick("signUp")}
              >
                Registrarse
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
