import Tweet from "./Tweet";
import '../styles/Tweets.css'
import { Link } from "react-router-dom";
import { useContext, useEffect } from "react";
import { decrypt, hexToBytes, verifyFirm } from "../util/crypto";
import { UserContext } from "./Contexts";


function Tweets(props) {
    
    const user = useContext(UserContext);

   
    const {tweets} = props;


    return (
        <div className="tweet-section">
            <div className="tweets">
                {
                    tweets.map((mess) => {
                        return mess && <Tweet key={mess.id} {...mess} />;
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