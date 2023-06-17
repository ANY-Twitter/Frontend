import Tweet from "./Tweet";
import '../styles/Tweets.css'
import { Link } from "react-router-dom";
import { useContext, useEffect } from "react";
import { decrypt, hexToBytes, verifyFirm } from "../util/crypto";
import { UserContext } from "./Contexts";


function Tweets(props) {
    
    const user = useContext(UserContext);

   
    /* useEffect( () => {
        fetch("http://localhost:8000/obtenerMensajes")
        .then(r => r.json())
        .then(ids => {
            const campos = ['message', 'hash', 'signedHash']
            console.log(ids.length)
            for(let ids_i = 0; ids_i < ids.length; ids_i++){
                for(let campo_i = 0; campo_i < campos.length; campo_i){

                }
                fetch("http://localhost:8000/obtenerCampo?_id={}&campo={}")
            }
            // fetch("http://localhost:8000/obtenerCampo?_id=648d38b5e0bdf54df968f200&campo=message")
        })     
    }) */

    const {tweets} = props;


    return (
        <div className="tweet-section">
            <div className="tweets">
                {
                    tweets.map((mess) => {

                        return <Tweet key={mess.id} {...mess} />;
                    })
                }

            </div>
            <div className="change-tweets">
                <Link className="button">Anterior</Link>
                <Link className="button">Siguiente</Link>
            </div>
        </div>
    )


}


export default Tweets;