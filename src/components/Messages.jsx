import '../styles/Messages.css'


function Messages(props){



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


export default Messages;