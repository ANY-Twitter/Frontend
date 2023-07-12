import { useContext, useState } from "react";
import { UserContext } from "./Contexts";
import '../styles/Config.css'
import '../styles/SignUp.css'


function Config({setIsLogged, setUser}){

    const [isAddingDevice,setIsAddingDevice] = useState(false);
    const user = useContext(UserContext);

    const toggleAddingDevice = () => setIsAddingDevice(!isAddingDevice);
    const signOut = () => {
        setIsLogged(false);
        setUser({keys:undefined})
    };


    return <div className="config-section">
        <h2>Configuración</h2>


        <div className="sign-out-section">
            <div className="button" onClick={toggleAddingDevice}>Agregar nuevo dispositivo</div>
            <div className="button" onClick={signOut}>Sign out</div>
        </div>

        <div className={`copy-key-section ${isAddingDevice ? '': 'off'}`}>
            <div className="copy-key-info">
                <div className="info">Inserte el siguiente valor en donde indique la vista de inicio de sesión (Nota: El siguiente valor <strong>no lo guarde</strong> en ningún lado, solo úselo donde se indique).</div>

                <div className="key-value">
                <input type="text" className="keys" disabled value={user.keys.exported_github_key}/>
                </div>

                <div className="button-section">
                <div className="button" onClick={toggleAddingDevice}>Close</div>
                </div>
            </div>
        </div>
    </div>



}


export default Config;