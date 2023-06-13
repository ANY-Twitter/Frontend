import { useEffect, useState } from "react";
import { redirect } from "react-router-dom";

function Inicio(){
    
    const [correo, setCorreo] = useState("");
    const [clave, setClave] = useState('');

    useEffect(()=>console.log(correo), [correo])

    async function Inicio_iniciar_sesion(){
        let resp = await fetch("http://127.0.0.1:8000/usuarios", {
            'method':'POST',
            'body': JSON.stringify({
                'correo': correo,
                'clave': clave
            }),
            'headers': {
                'Content-Type': "application/json"
            }
        });
        let texto = await resp.text()
        console.log(texto);
    }

    return (
        <div>
        <h1>Bienvenido a ANY-TWITTER</h1>
        <h2>Inicia sesión</h2>
        <p>Correo electrónico: </p>
        <input type="email" name="Inicio_correo" id="Inicio_correo" value={correo} onChange={ (e) => setCorreo(e.target.value) }/><br/>
        <p>Contraseña: </p>
        <input type="password" name="Inicio_clave" id="Inicio_clave" value={clave} onChange={ (e) => setClave(e.target.value) }/>
        <br />
        <button onClick={Inicio_iniciar_sesion}> Iniciar sesión</button> 
        <br />
        <h2>No tiene cuenta?</h2>
        <button type="button" >Registrese aquí</button>
        </div>
    );
}

export default Inicio;