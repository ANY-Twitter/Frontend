import { useContext } from 'react';
import { useState } from 'react';
import '../styles/SendMessage.css'
import { UserContext } from './Contexts.jsx';
import { genKey, cipher, decrypt } from '../util/crypto';


function SendMessage(props) {
    const user = useContext(UserContext);
    const [message, setMessage] = useState('');
    const [encMessage, setEncMessage] = useState('');







    const updateMessage = (e) => {
        setMessage(e.currentTarget.value);
    }


    return (
        <div className="send-message">
            <form noValidate>
                <input type="text" name="to_user" id="to_user" />
                <textarea name="user_message" onChange={updateMessage} value={message} id="user_message" cols="30" rows="10"></textarea>
                <div onClick={async () => { genKey(user); }} className="button">Enviar</div>
                <div onClick={async () => {
                    const {ct,sizes} = await cipher(user, message);
                    console.log(ct);
                }} className="button">Enviar2</div>
                <div onClick={async () => {

                    const { ct, sizes, hash} = await cipher(user, message);
                    console.log(ct,sizes);

                    const pt = await decrypt(user, ct,sizes,hash);

                    console.log(pt);

                }} className="button">Enviar3</div>
            </form>

        </div>
    )

}


export default SendMessage;