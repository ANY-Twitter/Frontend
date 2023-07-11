import '../styles/SignUp.css'
import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { genKey } from '../util/crypto';

function SignUp({setUser,setIsLogged}) {
  const [keys,setKeys] = useState({});


  const [formData,setFormData] = useState({
    name: '',
    handle: '',
    clave: '',
    rClave: '',
    img:'',
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

  async function submit(e) {
    e.preventDefault();

    if(existErrors()){
      
      console.log('bien',existErrors());
      return undefined;
    }

    const form = new FormData();

    form.append('name',formData.name);
    form.append('handle',formData.handle);
    form.append('password',formData.clave);
    form.append('user_photo',formData.img);
    form.append('keys',JSON.stringify({cipher_public: keys.cipher.public, sign_public: keys.sign.public}));

    let resp = await fetch("http://127.0.0.1:8000/crearUsuario", {
      method: "POST",
      body: form,
    });
    let user = await resp.json();

    if(resp.status === 200){
      setUser(user);
      setIsLogged(true);
      console.log(user);
      localStorage.setItem(user.handle,JSON.stringify(keys));
    }
  }

  useEffect(()=> {

    const valid = formData.clave == formData.rClave;

    setErrors({...errors,clave:!valid});
    // console.log(valid);

  },[formData.clave,formData.rClave]);
  
  useEffect(()=> {
    const generateKeys = async () => {
      const initialKeys = await genKey();
      // console.log(initialKeys)

      setKeys(initialKeys);

    }

    generateKeys();
  },[])


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
              setFormData({...formData,name: e.target.value});
              setErrors({...errors,name: !valid});
            }
            }
            className={errors.name ?  'invalid' : undefined}
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
              setFormData({...formData,handle: e.target.value});
              setErrors({...errors,"handle": !valid});
            }
            }
            className={errors.handle ?  'invalid' : undefined}
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
            onChange={(e) => setFormData({...formData,clave: e.target.value})}
            className={errors.clave ?  'invalid' : undefined}
          />
        </div>
        <div className="input-row">
          <label htmlFor="rclave">Repetir contraseña: </label>
          <input
            type="password"
            name="rclave"
            id="rclave"
            value={formData.rClave}
            onChange={(e) => setFormData({...formData,rClave: e.target.value})}
            className={errors.clave ?  'invalid' : undefined}
          />
        </div>
        <div className="input-row">
          <div className="text">Llaves:</div>
          <div className="text">Para el correcto funcionamiento de <strong>AnyTwitter</strong> necesitamos que guardes los siguientes valores en un repositorio en <a href='https://github.com'><strong>github</strong></a> llamado anytwitter.
          </div>
        </div>
        <div className="input-row">
          <label className='button' htmlFor="userPhoto">Inserta tu imagen de perfil</label>
          <input type="file" id="userPhoto" name="userPhoto" accept="image/*"
            onChange={(e) => {
              let file  = e.currentTarget.files[0];
              const newSrc = URL.createObjectURL(file);
              console.log(e.currentTarget.files);
              setFormData({...formData,img:file})
              // console.log(newSrc)
              setPrevSrc(newSrc);
            }}
          />
          <img id='prevImg' src={prevSrc} alt='No preview'/>
        </div>
        <div className="input-row">
          <button type="submit" className="button" onClick={submit}>Registrar</button>
        </div>
      </form>     
    </div>
  );
}

export default SignUp;
