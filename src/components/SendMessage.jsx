import { useContext } from 'react';
import { useState } from 'react';
import '../styles/SendMessage.css'
import { UserContext } from './Contexts.jsx';
import {maxSize, genKey, cipher, decrypt, verifyFirm } from '../util/crypto';


function SendMessage(props) {
    const user = useContext(UserContext);
    const [message, setMessage] = useState('');
    const [encMessage, setEncMessage] = useState('');
    const [handleTo,setHandleTo] = useState('');


    const updateMessage = (e) => {
        console.log(message)
        setMessage(e.currentTarget.value);
    }

    const updateHandleTo = (e) => {
        setHandleTo(e.currentTarget.value);
    }

    const submit = async (e) => {
        e.preventDefault();
        if(handleTo === '' || handleTo == user.handle) return undefined;
        let resp = await fetch("http://127.0.0.1:8000/getKeys/" + handleTo, {
            method: "GET",
        });

        if(resp.status === 200){
            const keys_raw = await resp.json();
            console.log(keys_raw);

            const {ct,hash,signedHash} = await cipher(user,message,keys_raw.cipher_public);
            console.log(ct,hash,signedHash);

            const form = new FormData();
            form.append('message',new Blob([ct]),{type: 'application/octet-stream'});
            form.append('hash_',new Blob([hash]),{type: 'application/octet-stream'});
            form.append('signedHash',new Blob([signedHash]),{type: 'application/octet-stream'});
            // let conv_ct = await new Blob([ct]).arrayBuffer();
            // console.log(ct)
            // console.log(new Uint8Array(conv_ct))
            // console.log(new Blob([ct],{type: 'application/octet-stream'}))
            // console.log(conv_ct)
            let resp_message = await fetch("http://127.0.0.1:8000/submitMessage" , {
                method: "POST",
                body: form
            });

            let resp_result = await resp_message.text();

            console.log(resp_result)

        }
    }


    return (
        <div className="send-message">
            <form noValidate>
                <input onChange={updateHandleTo} type="text" name="to_user" id="to_user" value={handleTo} />
                <textarea maxLength={maxSize()} name="user_message" onChange={updateMessage} value={message} id="user_message" cols="30" rows="10"></textarea>
                <button onClick={submit} className='button'>Enviar</button>
                <div onClick={async () => { genKey(user); }} className="button">Enviar</div>
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
                }} className="button">Enviar3</div>
            </form>

        </div>
    )

}


export default SendMessage;