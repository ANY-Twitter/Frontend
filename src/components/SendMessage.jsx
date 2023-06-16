import { useContext } from 'react';
import { useState } from 'react';
import '../styles/SendMessage.css'
import { UserContext } from './Contexts.jsx';
import { genKey, cipher } from '../util/crypto';


function SendMessage(props) {
    const user = useContext(UserContext);
    const [message,setMessage] = useState('');
    const [encMessage,setEncMessage] = useState('');

    

   

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