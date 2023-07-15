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
    const [messageSent,setMessageSent] = useState(false);
    const [errorUser,setErrorUser] = useState('');
    const [keysRaw,setKeysRaw] = useState({});

    const toggleNewUser = () => setNewUser(!newUser);
    const toggleMessageSent = () => setMessageSent(!messageSent);

    const updateMessage = (e) => {
        console.log(message)
        setMessage(e.currentTarget.value);
    }

    const updateHandleTo = (e) => {
        setHandleTo(e.currentTarget.value);
    }

    const findUser = (array,username) => {
        for(const elem of array){
            if(elem.handle === username) return elem;
        }

        return null;
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

        const { ct, signedHash } = await cipher(user, message, keysRaw.cipher);
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
        toggleMessageSent();
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
            const resp = await fetch("http://127.0.0.1:8000/getKeysList", {
                method: "GET",
            });


            

            if (resp.status === 400) {
                setErrorUser('Unexpect error');
            }
            else if (resp.status === 200) {
                const githubUrl = `https://raw.githubusercontent.com/${handleTo}/anytwitter/main/public.json`
                // const githubUrl = `https://api.github.com/repos/${handleTo}/anytwitter/contents/public.json`;
                const allUsers = await resp.json();
                const userTo = findUser(allUsers,handleTo);

                if(!userTo){
                    setErrorUser('User not found');
                    return undefined;
                }

                const respKeys = JSON.parse(userTo.keys);

                const verifier = await fetch(githubUrl,
                    {
                        headers: {
                            // Authorization: "token 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"
                        },
                        cache: "no-store"
                    });
                // const verifierKeys = JSON.parse(window.atob((await verifier.json()).content));
                const verifierKeys = (await verifier.json());
                    
                console.log('a', verifierKeys);
                console.log('b', JSON.stringify(respKeys));
                console.log('b',JSON.stringify(verifierKeys) === JSON.stringify(respKeys));
                if(verifier.status === 404 || JSON.stringify(verifierKeys) !== JSON.stringify(respKeys)){
                    setErrorUser('For security reasons cannot send message to this user');
                    return undefined;
                }
                setKeysRaw(respKeys);
                toggleNewUser();
                setErrorUser('');
            }
        }
    }

    useEffect(() => {
        if (keysRaw.send) sendMessage();
    }, [keysRaw]);


    return (
        <div className="send-message">
            <form noValidate>
                <input className={`${errorUser !== '' ? 'invalid' : ''}`} onChange={updateHandleTo} type="text" name="to_user" id="to_user" value={handleTo} />
                <textarea maxLength={maxSize()} name="user_message" onChange={updateMessage} value={message} id="user_message" cols="30" rows="10"></textarea>
                <button onClick={submit} className='button'>Enviar</button>
            </form>
            <div className={`confirm-section ${newUser ? '' : 'off'}`}>
                <div className={"confirm-section-info"}>
                    <div className="info">¿Está seguro de enviar el mensaje a <strong>{handleTo}</strong>? Tenga cuidado con enviar información sensible a una persona equivocada.</div>
                    <div className="button-section">
                        <div className="button" onClick={() => {
                            setKeysRaw((prevKeys) => { return { ...prevKeys, send: 1 }; });
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
            <div className={`message-sent-section ${messageSent ? '' : 'off'}`}>
                <div className={"message-sent-info"}>
                    <div className="info">Mensaje enviado correctamente a {handleTo}</div>
                    <div className="button-section">
                        <div className="button" onClick={() => {
                            toggleMessageSent();
                        }}>Ok</div>
                    </div>
                </div>
            </div>
        </div>
    )

}


export default SendMessage;