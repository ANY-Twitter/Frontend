import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";

function SignUp() {
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [rClave, setRClave] = useState("");

  async function Consultar_Sign_Up() {
    let resp = await fetch("http://127.0.0.1:8000/crearUsuario", {
      method: "POST",
      body: JSON.stringify({
        correo: correo,
        clave: clave,
        rclave: rClave
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    let texto = await resp.text();
    console.log(texto);
  }

  return (
    <div>
      <h1>ANY-TWITTER</h1>
      <h2>Regístrese</h2>
      <p>Correo electrónico: </p>
      <input
        type="email"
        name="correo"
        id="correo"
        value={correo}
        onChange={(e) => setCorreo(e.target.value)}
      />
      <br />
      <p>Contraseña: </p>
      <input
        type="password"
        name="clave"
        id="clave"
        value={clave}
        onChange={(e) => setClave(e.target.value)}
      />
      <br />
      <p>Repetir Contraseña: </p>
      <input
        type="password"
        name="rclave"
        id="rclave"
        value={rClave}
        onChange={(e) => setRClave(e.target.value)}
      />
      <br />
      <button className="button" onClick={Consultar_Sign_Up}>Registrar</button>
      
    </div>
  );
}

export default SignUp;
