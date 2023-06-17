import Tweet from "./Tweet";
import '../styles/Tweets.css'
import { Link } from "react-router-dom";
import { useEffect } from "react";


function Tweets(props) {

    useEffect( () => {
        fetch("http://localhost:8000/obtenerMensajes")
        .then(r => r.blob())
        .then(r => r.arrayBuffer())
        .then(r => console.log(new Uint8Array(r)));
        

    })

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