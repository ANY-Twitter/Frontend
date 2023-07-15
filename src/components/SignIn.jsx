import { useContext, useEffect, useState } from "react";
import { Link, Outlet, redirect, useNavigate } from "react-router-dom";
import '../styles/SignIn.css'
import { cipher, genKey, genKeyPass, hexToBytes, simetricCipher, simetricDecrypt, toHexString } from "../util/crypto";
import { UserContext } from "./Contexts";


function SignIn({setUser, setIsLogged}) {
  const [githubKey,setGithubKey] = useState('');
  const [githubKeyError,setGithubKeyError] = useState(false);
  const [addNewDevice,setAddNewDevice] = useState(false);
  const user = useContext(UserContext);
  const [handle, setHandle] = useState("");
  const [clave, setClave] = useState("");

  const toggleAddNewDevice = () => setAddNewDevice(!addNewDevice);
  const navegar = useNavigate();

  async function loadKeys(){
    const baseUrl = `https://api.github.com/repos/${handle}/anytwitter/contents/`;
    const files = [['public.json', 'public'],
                  ['private.json', 'private']];
    let keys  = {cipher:{},sign:{}};
    let error = false;

    for( const [fileName,type] of files){
      console.log(fileName);
      let response = await fetch(baseUrl + fileName, {
        headers: {
          // Authorization: "token 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"
        },
        cache: "no-store"
      });
      let github_response = await response.json();
      let response_json = JSON.parse(window.atob(github_response.content));
      let signKey;
      let cipherKey;

      if (type == 'private') {
        const keys_ct = response_json['value'];
        const keys_raw = await simetricDecrypt(
          hexToBytes(keys_ct),
          new Uint8Array(12),
          hexToBytes(githubKey)
        );

        if (keys_raw) {
          const dec = new TextDecoder();
          const key_json = JSON.parse(dec.decode(keys_raw));

          cipherKey = key_json['cipher'];
          signKey = key_json['sign'];

          error = false;
          console.log('ke', error);
        } else {
          error = true
          cipherKey = '';
          signKey = '';
        }


      } else {
        cipherKey = response_json['cipher'];
        signKey = response_json['sign'];
      }

      keys['cipher'][type] = cipherKey;
      keys['sign'][type] = signKey;
    }

    // console.log('como es esto posible', hola);
    // console.log('como es esto posible', keys);
    setGithubKeyError(error);

    console.log(keys);

    keys['exported_github_key'] = githubKey;

    if (!error) {

      const salt = window.crypto.getRandomValues(new Uint8Array(16));
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      const localKey = await genKeyPass(clave, salt);
      const ct_keys_raw = await simetricCipher(JSON.stringify(keys), hexToBytes(localKey), iv);
      const ct_key = toHexString(ct_keys_raw);

      // console.log(ct_key);


      const dec = new TextDecoder();
      const keys_raw = await simetricDecrypt(hexToBytes(ct_key), iv, hexToBytes(localKey));

      // console.log('a',keys_raw);
      // console.log(dec.decode(keys_raw));


      setIsLogged(true);
      setUser((prevUser) => { return { ...prevUser, keys }; });
      navegar('/home');
      localStorage.setItem(user.handle, JSON.stringify({ keys: ct_key, iv: toHexString(iv), salt: toHexString(salt) }));
    }

  }

  async function login(e) {
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

    if (resp.status == 200) {
      const response_user = await resp.json();
      console.log(response_user, resp.status);
      setUser((prevUser) => { return { ...prevUser, ...response_user }; });

      if (localStorage.getItem(response_user.handle)) {
        const storedUserDataString = localStorage.getItem(response_user.handle);
        const { keys: ct_keys, iv, salt } = JSON.parse(storedUserDataString);

        const localKey = await genKeyPass(clave, hexToBytes(salt));
        const dec = new TextDecoder();
        const keys_raw = await simetricDecrypt(hexToBytes(ct_keys), hexToBytes(iv), hexToBytes(localKey));
        const keys = JSON.parse(dec.decode(keys_raw));

        setUser((prevUser) => { return { ...prevUser, keys }; });
        setIsLogged(true);
        navegar('/home');
      } else {
        console.log('Existo, pero no aqui');
        toggleAddNewDevice();
      }

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
          <button className="button" type="submit" onClick={login}> Iniciar sesión</button>
        </div>
        <br />
      </form>
      <h2>No tiene cuenta?</h2>
      <Link to="/sign-up" className="button">Registrese aquí</Link>
      <div className={`add-new-device-section ${addNewDevice ? '' : 'off'}`}>
        <div className="add-new-device-input">
          <div className="info">Ve a la configuración de alguno de tus dispositivos, clickee el boton <strong><em>Agregar nuevo dispositivo</em></strong>. Finalmente pegue el valor que le sale en la caja de abajo.</div>
          <div className="key-value">
            <input type="text" className={`key ${githubKeyError ? 'invalid' : ''}`}
              onChange={(e) => setGithubKey(e.currentTarget.value)}
              value={githubKey} />
          </div>
          <div className="button-section">
            <div className="button" onClick={loadKeys}>Accept</div>
            <div className="button" onClick={() => {
              toggleAddNewDevice();
              setUser({ keys: undefined });
            }}>Cancel</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
