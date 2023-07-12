import '../styles/SignUp.css'
import { useContext, useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { genKey, genKeyPass, simetricCipher, toHexString} from '../util/crypto';
import {UserContext} from './Contexts'

function SignUp({setUser,setIsLogged}) {

  const user = useContext(UserContext);

  const [publicKeyError,setPublicKeyError] = useState(false);
  const [privateKeyError,setPrivateKeyError] = useState(false);


  const [formData,setFormData] = useState({
    name: '',
    handle: '',
    clave: '',
    rClave: '',
    img:'',
    public_keys_form:'',
    private_keys_form:'',
  });
  const [prevSrc,setPrevSrc] = useState('');
  const [errors,setErrors] =  useState({
    name:false,
    handle:false,
    clave:false,
  });

  const existErrors = () => {
    // console.log('s',errors.hasOwnProperty('handle'))
    let result = false;
    for(const field in errors){

      if(errors[field] || formData[field] === '') {
        setErrors((prevState) => 
          {return {...prevState,[field]:true};}
        );
        result = true;
      }
    }
    return result;

  }

  async function verifyGithubKeys() {
    const baseUrl = `https://api.github.com/repos/${formData.handle}/anytwitter/contents/`;
    const files = [['public.json', formData.public_keys_form],
                  ['private.json', formData.private_keys_form]];
    console.log(baseUrl);

    return files.map(async ([file,expectedValue]) => {
      let response = await fetch(baseUrl + file, {headers:{Authorization: "token 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"}, cache: "no-store" });

      if(response.status === 404 || response.status === 400) 
        return 'Does not exists';
      
      let response_json;

      try{
        const temp = await response.json();
        const data_raw = atob(temp.content);
        console.log(data_raw);
        response_json = JSON.parse(data_raw);
      }catch(error){
        return 'Not expected value';
      }

      const response_string = JSON.stringify(response_json);

      // let mistmatch = '';
      // let expected = '';

      // console.log(file,'esperado:',expectedValue,expectedValue.length,expectedValue[expectedValue.length-1]);
      // console.log(file,'recibido',response_string,response_string.length,response_string.charCodeAt(response_string.length-1));
      // console.log(file,'recibido',response_string === expectedValue);

      // for(let i = 0; i < expectedValue.length;++i){
      //   if(i < response_string.length && response_string[i] !== expectedValue[i]){
      //     mistmatch += response_string[i];
      //     expected += expectedValue[i];
      //     // console.log(i)
      //   }
      // }
      // console.log('fallo: ',mistmatch.length);
      // console.log('fallo:',expected.length);

      return response_string !== expectedValue ? 'Not value requested' : '';

    })



  }

  async function submit(e) {
    e.preventDefault();

    const [publicResult,privateResult] = await Promise.all(await verifyGithubKeys());

    console.log(publicResult,privateResult)
    
    setPublicKeyError(publicResult !== '');
    setPrivateKeyError(privateResult !== '');


    if (existErrors() || publicResult !== '' || privateResult !== '') {

      // console.log('ke');
      // console.log('bien', existErrors());
      return undefined;
    }

    const form = new FormData();

    form.append('name', formData.name);
    form.append('handle', formData.handle);
    form.append('password', formData.clave);
    form.append('user_photo', formData.img);
    form.append('keys', JSON.stringify({ cipher_public: user.keys.cipher.public, sign_public: user.keys.sign.public }));

    let resp = await fetch("http://127.0.0.1:8000/crearUsuario", {
      method: "POST",
      body: form,
    });
    let response_user = await resp.json();

    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    const localKey = await genKeyPass(formData.clave,salt);
    const ct_keys_raw = await simetricCipher(JSON.stringify(user.keys),localKey,iv);
    const ct_key = toHexString(ct_keys_raw);

    // console.log(JSON.stringify(user.keys));
    if (resp.status === 200) {
      setUser({...user,...response_user});
      setIsLogged(true);
      console.log(response_user);
      localStorage.setItem(response_user.handle, JSON.stringify({keys:ct_key,iv:toHexString(iv),salt:toHexString(salt)}));
    }
  }

  useEffect(() => {


    const valid = formData.clave == formData.rClave;

    setErrors({ ...errors, clave: !valid });
    // console.log(valid);

  }, [formData.clave, formData.rClave]);

  useEffect(() => {
    const generateKeys = async () => {
      // let initial = new Date().getTime();
      if(user.keys){
        return undefined;
      }
      const initialKeys = await genKey();//agregar llave simetríca github
      console.log(initialKeys)
      // console.log((new Date().getTime() - initial)/1000);

      setUser({...user,keys:initialKeys});
      const public_keys_form_json = { cipher: initialKeys.cipher.public, sign: initialKeys.sign.public };
      const private_keys_form_json = { cipher: initialKeys.cipher.private, sign: initialKeys.sign.private };


      // initial = new Date().getTime();
      const ct_private_keys_form_json = await simetricCipher(JSON.stringify(private_keys_form_json), initialKeys.exported_github_key, new Uint8Array(12));
      // console.log(ct_private_keys_form_json);
      // console.log((new Date().getTime() - initial)/1000);
      setFormData({
        ...formData,
        public_keys_form: JSON.stringify(public_keys_form_json),
        private_keys_form: JSON.stringify({value:toHexString(ct_private_keys_form_json)})
      })

    }

    generateKeys();
  }, [])


  return (
    <div className="sign-up">
      <h1>ANY-TWITTER</h1>
      <h2>Regístrese</h2>
      <form action="" noValidate>
        <div className="input-row">
          <label htmlFor="name">Nombre: </label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={(e) => {
              const elem = e.currentTarget;
              const valid = elem.validity.valid;
              console.log(valid);
              setFormData({ ...formData, name: e.target.value });
              setErrors({ ...errors, name: !valid });
            }
            }
            className={errors.name ? 'invalid' : undefined}
            required
          />
        </div>
        <div className="input-row">
          <label htmlFor="handle">Identificador (Handle): </label>
          <input
            type="text"
            name="handle"
            id="handle"
            value={formData.handle}
            onChange={(e) => {
              const elem = e.currentTarget;
              const valid = elem.validity.valid;
              console.log(valid);
              setFormData({ ...formData, handle: e.target.value });
              setErrors({ ...errors, "handle": !valid });
            }
            }
            className={errors.handle ? 'invalid' : undefined}
            required
          />
        </div>
        <div className="input-row">
          <label htmlFor="clave">Contraseña:</label>
          <input
            required
            type="password"
            name="clave"
            id="clave"
            value={formData.clave}
            onChange={(e) => setFormData({ ...formData, clave: e.target.value })}
            className={errors.clave ? 'invalid' : undefined}
          />
        </div>
        <div className="input-row">
          <label htmlFor="rclave">Repetir contraseña: </label>
          <input
            type="password"
            name="rclave"
            id="rclave"
            value={formData.rClave}
            onChange={(e) => setFormData({ ...formData, rClave: e.target.value })}
            className={errors.clave ? 'invalid' : undefined}
          />
        </div>
        <div className="input-row">
          <div className="text">Llaves:</div>
          <div className="text">Para el correcto funcionamiento de <strong>AnyTwitter</strong> necesitamos que guardes los siguientes valores en un repositorio en <a target="_blank" rel='noreferrer' href='https://github.com/new?name=anytwitter'><strong>github</strong></a> llamado <strong>anytwitter</strong> (Nota: el usuario de github debe ser <strong>exactamente</strong> igual al handle ingresado y la rama debe ser <strong>main</strong>).
          </div>
          <label htmlFor="public_keys">Llaves publicas (nombre el archivo <strong>public.json</strong>):</label>
          <input className={`keys ${publicKeyError ? 'invalid' : ''}`} type="text" name="public_keys" id="public_keys" value={formData.public_keys_form} disabled />
          <label htmlFor="public_keys">Llaves privadas (nombre el archivo <strong>private.json</strong>):</label>
          <input className={`keys ${privateKeyError ? 'invalid' : ''}`} type="text" name="private_keys" id="private_keys" value={formData.private_keys_form} disabled />
        </div>
        <div className="input-row">
          <label className='button' htmlFor="userPhoto">Inserta tu imagen de perfil</label>
          <input type="file" id="userPhoto" name="userPhoto" accept="image/*"
            onChange={(e) => {
              let file = e.currentTarget.files[0];
              const newSrc = URL.createObjectURL(file);
              console.log(e.currentTarget.files);
              setFormData({ ...formData, img: file })
              // console.log(newSrc)
              setPrevSrc(newSrc);
            }}
          />
          <img id='prevImg' src={prevSrc} alt='No preview' />
        </div>
        <div className="input-row">
          <button type="submit" className="button" onClick={submit}>Registrar</button>
        </div>
      </form>
    </div>
  );
}

export default SignUp;
