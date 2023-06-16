import { useContext, useEffect, useState } from "react";
import { Link, Outlet, redirect, useNavigate } from "react-router-dom";
import '../styles/SignIn.css'

function SignIn({setUser, setIsLogged}) {
  const [handle, setHandle] = useState("");
  const [clave, setClave] = useState("");

  const navegar = useNavigate();

  async function Inicio_iniciar_sesion(e) {
    e.preventDefault();
    let resp = await fetch("http://127.0.0.1:8000/usuarios", {
      method: "POST",
      body: JSON.stringify({
        handle: handle,
        password: clave,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    let user = await resp.json();
    console.log(user, resp.status);
    if(resp.status == 200){
      setIsLogged(true);
      setUser(user);
      navegar('/home');
    }
  }

  return (
    <div className="sign-in">
      <h1>Bienvenido a ANY-TWITTER</h1>
      <h2>Inicia sesión</h2>
      <form action="" noValidate>
        <div className="input-row">
          <label htmlFor="handle">Identificador de usuario: </label>
          <input
            type="text"
            name="handle"
            id="handle"
            value={handle}
            onChange={(e) => setHandle(e.currentTarget.value)}
          />
        </div>
        <div className="input-row">
          <label htmlFor="clave">Contraseña: </label>
          <input
            type="password"
            name="clave"
            id="clave"
            autoComplete="on"
            value={clave}
            onChange={(e) => setClave(e.currentTarget.value)}
          />
        </div>
        <div className="input-row">
          <button className="button" type="submit" onClick={Inicio_iniciar_sesion}> Iniciar sesión</button>
        </div>
        <br />
      </form>
      <h2>No tiene cuenta?</h2>
      <Link to="/sign-up" className="button">Registrese aquí</Link>
    </div>
  );
}

export default SignIn;
