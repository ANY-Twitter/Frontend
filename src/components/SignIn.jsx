import { useContext, useEffect, useState } from "react";
import { Link, Outlet, redirect, useNavigate } from "react-router-dom";
import '../styles/SignIn.css'
import { genKey, genKeyPass, hexToBytes, simetricCipher, simetricDecrypt, toHexString } from "../util/crypto";
import { UserContext } from "./Contexts";


function SignIn({setUser, setIsLogged}) {
  const user = useContext(UserContext);
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

    let response_user = await resp.json();
    console.log(response_user, resp.status);
    if(resp.status == 200){
      const storedUserDataString = localStorage.getItem(response_user.handle);
      const {keys:ct_keys,iv,salt} = JSON.parse(storedUserDataString);

      const localKey = await genKeyPass(clave,hexToBytes(salt));
      const dec = new TextDecoder();
      const keys_raw =  await simetricDecrypt(hexToBytes(ct_keys),hexToBytes(iv),hexToBytes(localKey));
      const keys = JSON.parse(dec.decode(keys_raw));


      
      setIsLogged(true);
      setUser({...response_user,keys});
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
