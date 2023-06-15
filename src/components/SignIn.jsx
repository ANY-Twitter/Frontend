import { useContext, useEffect, useState } from "react";
import { Link, Outlet, redirect, useNavigate } from "react-router-dom";

function SignIn(props) {
  const {setUser} = props;
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");

  const navegar = useNavigate();

  async function Inicio_iniciar_sesion() {
    let resp = await fetch("http://127.0.0.1:8000/usuarios", {
      method: "POST",
      body: JSON.stringify({
        correo: correo,
        clave: clave,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    let texto = await resp.text();
    console.log(texto, resp.status);
    if(resp.status == 200){
      setUser(correo);
      navegar('/home');
    }
  }

  return (
    <div>
      <h1>Bienvenido a ANY-TWITTER</h1>
      <h2>Inicia sesión</h2>
      <p>Correo electrónico: </p>
      <input
        type="email"
        name="Inicio_correo"
        id="Inicio_correo"
        value={correo}
        onChange={(e) => setCorreo(e.target.value)}
      />
      <br />
      <p>Contraseña: </p>
      <input
        type="password"
        name="Inicio_clave"
        id="Inicio_clave"
        value={clave}
        onChange={(e) => setClave(e.target.value)}
      />
      <br />
      <button onClick={Inicio_iniciar_sesion}> Iniciar sesión</button>
      <br />
      <h2>No tiene cuenta?</h2>
      <Link to="/signup" className="button">Registrese aquí</Link>
      <Outlet />
    </div>
  );
}

export default SignIn;
