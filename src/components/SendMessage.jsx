import { useContext, useEffect } from 'react';
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
    const [keysRaw,setKeysRaw] = useState({});


    const toggleNewUser = () => setNewUser(!newUser);
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

    const sendMessage = async () => {
        console.log(keysRaw);

        const { ct, signedHash } = await cipher(user, message, keysRaw.cipher_public);
        // console.log(ct,hash,signedHash);


        let resp_message = await fetch("http://localhost:8000/submitMessage", {
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({
                'message': toHexString(ct),
                'signedHash': toHexString(signedHash)
            })
        });

        console.log('Se envio: ', message);
        setKeysRaw({});
    }

    const submit = async (e) => {
        e.preventDefault();
        if (checkErrors()) {
            return undefined;
        }


        let currentLocalKeys = {}



        if (localStorage.getItem('savedKeys'))
            currentLocalKeys = JSON.parse(localStorage.getItem('savedKeys'));

        if (currentLocalKeys[handleTo]) {
            setKeysRaw({...currentLocalKeys[handleTo],send:1});
            setErrorUser('');
        }

        else {
            let resp = await fetch("http://127.0.0.1:8000/getKeys/" + handleTo, {
                method: "GET",
            });

            if (resp.status === 400) {
                setErrorUser('User does not exists')
            }
            else if (resp.status === 200) {
                setKeysRaw(await resp.json());
                toggleNewUser();
                setErrorUser('');
            }
        }
    }

    useEffect(() => {
        if(keysRaw.send) sendMessage();
    },[keysRaw]);


    return (
        <div className="send-message">
            <form noValidate>
                <input className={`${errorUser !== '' ? 'invalid' : ''}`} onChange={updateHandleTo} type="text" name="to_user" id="to_user" value={handleTo} />
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
                    <div className="info">¿Está seguro de enviar el mensaje a <strong>{handleTo}</strong>? Tenga cuidado con enviar información sensible a una persona equivocada.</div>
                    <div className="button-section">
                        <div className="button" onClick={() => {
                            setKeysRaw((prevKeys)=> {return {...prevKeys,send:1};});
                            let currentLocalKeys = {};

                            if (localStorage.getItem('savedKeys')) {
                                currentLocalKeys = JSON.parse(localStorage.getItem('savedKeys'));
                            }

                            currentLocalKeys[handleTo] = keysRaw;

                            localStorage.setItem('savedKeys', JSON.stringify(currentLocalKeys));


                            toggleNewUser();
                        }}>Accept</div>
                        <div className="button" onClick={() => {
                            setKeysRaw({});
                            toggleNewUser();
                        }}>Cancel</div>
                    </div>
                </div>
            </div>
        </div>
    )

}


export default SendMessage;