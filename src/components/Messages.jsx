import '../styles/Home.css'
import Tweets from "./Tweets";
import { Link, json } from "react-router-dom";
import user_photo from "../img/test-username-photo.jpeg";
import '../styles/Messages.css'
import { UserContext } from './Contexts.jsx';
import { useContext, useEffect, useState } from 'react';
import { decrypt, hexToBytes, verifyFirm } from '../util/crypto';



function Messages(props) {

    const user = useContext(UserContext);
    const [tweets, setTweets] = useState([]);

    useEffect(() => {

        const getTwets = async () => {

            const final_tweets = []
            const messages_resp = await fetch("http://localhost:8000/obtenerMensajes");
            const messages = await messages_resp.json();

            let a = messages.map(async (elem) => {
                const hash = hexToBytes(elem.hash);
                const signedHash = hexToBytes(elem.signedHash);
                const message = hexToBytes(elem.message);


                const final_message = await decrypt(user, message, hash);
                if (final_message) {
                    const keys_resp = await fetch("http://localhost:8000/getKeys/" + final_message.handle);
                    const keys = await keys_resp.json();
                    const isValid = await verifyFirm(final_message.pt, signedHash, keys.sign_public);
                    if (isValid) {
                        console.log('este se desencripta', final_message);
                        return {
                                id: elem._id,
                                name: final_message.name,
                                handle: final_message.handle,
                                data: final_message.pt,
                                srcImg: user_photo,
                                isTweet: false,
                            }


                    }
                }

                return undefined;


            })

            let result = await Promise.all(a);

            console.log('estos son los finales', result);

            setTweets(result);

        }

        getTwets();

    }, []);



    return (
        <div className="messages-section">
            <h2>Messages</h2>
            <Tweets tweets={tweets} />
        </div>
    )


}


export default Messages;