import { useEffect, useState } from "react";
import { redirect } from "react-router-dom";

function Inicio(){
    
    const [correo, setCorreo] = useState("");
    const [clave, setClave] = useState('');

    useEffect(()=>console.log(correo), [correo])

    function Inicio_iniciar_sesion(){
        window.location = "/login"
    }

    return (
        <div>
        <h1>Bienvenido a ANY-TWITTER</h1>
        <h2>Inicia sesión</h2>
        <form action="#">
        <label htmlFor="Inicio_correo">Correo electrónico: </label>
        <input type="email" name="Inicio_correo" id="Inicio_correo" value={correo} onChange={ (e) => setCorreo(e.target.value) }/><br/>
        <label htmlFor="Inicio_clave">Contraseña: </label>
        <input type="password" name="Inicio_clave" id="Inicio_clave" value={clave} onChange={ (e) => setClave(e.target.value) }/>
        <br />
        <button type="submit" onClick={Inicio_iniciar_sesion}> Iniciar sesión</button> 
        </form>
        <br />
        <h2>No tiene cuenta?</h2>
        <button type="button" >Registrese aquí</button>
        </div>
    );
}

export default Inicio;