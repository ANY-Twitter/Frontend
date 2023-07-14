import { useContext } from 'react';
import { useState } from 'react';
import '../styles/SendMessage.css'
import { UserContext } from './Contexts.jsx';
import {maxSize, genKey, cipher, decrypt, verifyFirm, toHexString } from '../util/crypto';


function SendMessage(props) {
    const user = useContext(UserContext);
    const [message, setMessage] = useState('');
    const [encMessage, setEncMessage] = useState('');
    const [handleTo,setHandleTo] = useState('');
    const [newUser,setNewUser] = useState(false);
    const [errorUser,setErrorUser] = useState('');


    const updateMessage = (e) => {
        console.log(message)
        setMessage(e.currentTarget.value);
    }

    const updateHandleTo = (e) => {
        setHandleTo(e.currentTarget.value);
    }

    const checkErrors = () => {

        if(handleTo === '' || handleTo == user.handle || message.length > maxSize()) {
            if(handleTo === '') setErrorUser('Empty handle');
            else if(handleTo === user.handle) setErrorUser('Same User');
            else if(message.length === maxSize()) setErrorUser(`Supera el maximo de tamaño (${maxSize()})`);


            return true;
        }

        setErrorUser('');

        return false;

    }

    const submit = async (e) => {
        e.preventDefault();
        if(checkErrors()) {
            return undefined;
        }


        let resp = await fetch("http://127.0.0.1:8000/getKeys/" + handleTo, {
            method: "GET",
        });

        if(resp.status === 400){
            setErrorUser('User does not exists')
        }
        else if(resp.status === 200){
            const keys_raw = await resp.json();
            // console.log(keys_raw);

            const {ct,signedHash} = await cipher(user,message,keys_raw.cipher_public);
            // console.log(ct,hash,signedHash);


            let resp_message = await fetch("http://localhost:8000/submitMessage", {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify({
                    'message': toHexString(ct),
                    'signedHash':toHexString(signedHash) 
                })
            });

            console.log('Se envio: ',message);

            // let resp_result = await resp_message.text();

            // console.log(resp_result)
            setErrorUser('');

        }
    }


    return (
        <div className="send-message">
            <form noValidate>
                <input className={`${errorUser !== '' ? 'invalid' : ''}`}onChange={updateHandleTo} type="text" name="to_user" id="to_user" value={handleTo} />
                <textarea maxLength={maxSize()} name="user_message" onChange={updateMessage} value={message} id="user_message" cols="30" rows="10"></textarea>
                <button onClick={submit} className='button'>Enviar</button>
                {/* <div onClick={async () => { genKey(user); }} className="button">Enviar</div>
                <div onClick={async () => {
                    const {ct,hash, signedHash} = await cipher(user, message);
                    console.log(ct);
                }} className="button">Enviar2</div>
                <div onClick={async () => {

                    const { ct,  hash, signedHash } = await cipher(user, message);
                    console.log(ct,hash,signedHash);

                    const final_message = await decrypt(user, ct, hash );
                    if(final_message){
                        const isValid = await verifyFirm(final_message.pt,signedHash);

                        console.log(isValid)
                        console.log(final_message);


                    }
                }} className="button">Enviar3</div> */}
            </form>
            <div className={`confirm-section ${newUser ? '' : 'off'}`}>
                <div className={"confirm-section-info"}>
                    <div className="info">Ve a la configuración de alguno de tus dispositivos, clickee el boton <strong><em>Agregar nuevo dispositivo</em></strong>. Finalmente pegue el valor que le sale en la caja de abajo.</div>
                    <div className="button-section">
                        <div className="button" >Accept</div>
                        <div className="button" onClick={() => {
                        }}>Cancel</div>
                    </div>
                </div>
            </div>
        </div>
    )

}


export default SendMessage;