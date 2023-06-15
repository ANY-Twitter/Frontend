import { useState } from 'react';
import '../styles/SendMessage.css'


function SendMessage(props) {
    const [message,setMessage] = useState('');
    const [encMessage,setEncMessage] = useState('');

    const genKey = async () => {
        let keyPair = await window.crypto.subtle.generateKey(
            {
                name: "RSA-OAEP",
                modulusLength: 4096,
                publicExponent: new Uint8Array([1, 0, 1]),
                hash: "SHA-256",
            },
            true,
            ["encrypt", "decrypt"]
        );

        const private_exported_key = await window.crypto.subtle.exportKey('jwk',keyPair.privateKey);
        const public_exported_key = await window.crypto.subtle.exportKey('jwk',keyPair.publicKey);

        localStorage.setItem('private_key',JSON.stringify(private_exported_key));
        localStorage.setItem('public_key',JSON.stringify(public_exported_key));

        console.log(private_exported_key);

    }

    const cipher = async () => {
        const public_key_raw = JSON.parse(localStorage.getItem('public_key'));
        const public_key = await crypto.subtle.importKey('jwk',public_key_raw,{
                name: "RSA-OAEP",
                hash: "SHA-256",
            },false,["encrypt"]);
        const enc = new TextEncoder();
        const dec = new TextDecoder();

        const ct = await crypto.subtle.encrypt({name: 'RSA-OAEP'},public_key,enc.encode(message));
        setEncMessage(ct);

        console.log(dec.decode(ct));


    }

    const decrypt = async () => {

        const private_key_raw = JSON.parse(localStorage.getItem('private_key'));
        const private_key = await crypto.subtle.importKey('jwk',private_key_raw,{
                name: "RSA-OAEP",
                hash: "SHA-256",
            },false,["decrypt"]);
        const dec = new TextDecoder();

        const pt = await crypto.subtle.decrypt({name: 'RSA-OAEP'},private_key,encMessage);

        console.log(dec.decode(pt));
    }

    const updateMessage = (e) => {
        setMessage(e.currentTarget.value);
    }



    return (
        <div className="send-message">
            <form noValidate>
                <input type="text" name="to_user" id="to_user" />
                <textarea name="user_message" onChange={updateMessage} value={message} id="user_message" cols="30" rows="10"></textarea>
                <div onClick={genKey} className="button">Enviar</div>
                <div onClick={cipher} className="button">Enviar2</div>
                <div onClick={decrypt} className="button">Enviar3</div>
            </form>

        </div>
    )

}


export default SendMessage;