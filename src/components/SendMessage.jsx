import { useContext } from 'react';
import '../styles/SendMessage.css'
import { UserContext } from './Contexts.jsx';


function SendMessage(props){

    const user = useContext(UserContext);

    return (
        <div className="send-message">
            <form noValidate>
                <input type="text" name="to_user" id="to_user"/>
                <textarea name="" id="" cols="30" rows="10"></textarea>
                <div className="button">Enviar</div>
            </form>

        </div>
        )

}


export default SendMessage;