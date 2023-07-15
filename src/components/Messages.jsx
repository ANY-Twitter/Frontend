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

    const findUser = (array,username) => {
        for(const elem of array){
            if(elem.handle === username) return elem;
        }

        return null;
    }

    useEffect(() => {

        const getTwets = async () => {

            const final_tweets = []
            const messages_resp = await fetch("http://localhost:8000/obtenerMensajes");
            const keysResp = await fetch("http://127.0.0.1:8000/getKeysList", {
                method: "GET",
            });
            const allUsers = await keysResp.json();
            const messages = await messages_resp.json();

            let allMessages = messages.map(async (elem) => {
                const signedHash = hexToBytes(elem.signedHash);
                const message = hexToBytes(elem.message);


                const final_message = await decrypt(user, message);

                if (final_message) {
                    const githubUrl = `https://api.github.com/repos/${final_message.handle}/anytwitter/contents/public.json`;
                    const userFrom = findUser(allUsers,final_message.handle);

                    if(!userFrom){
                        return undefined;
                    }

                    const keys = JSON.parse(userFrom.keys);

                    const verifier = await fetch(githubUrl,
                        {
                            headers: {
                                Authorization: "token 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"
                            },
                            cache: "no-store"
                        });
                    const verifierKeys = await verifier.json();
                        
                    // console.log('a', window.atob(verifierKeys.content));
                    // console.log('b', JSON.stringify(keys));
                    // console.log('b', window.atob(verifierKeys.content) === JSON.stringify(keys));
                    if(verifier.status === 404 || JSON.stringify(JSON.parse(window.atob(verifierKeys.content))) !== JSON.stringify(keys)){
                        console.log('For security reasons cannot send message to this user');
                        return undefined;
                    }

                    const isValid = await verifyFirm(final_message.pt, signedHash, keys.sign);
                    if (isValid) {
                        console.log('este se desencripta', final_message);
                        return {
                                id: elem.id,
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

            let result = await Promise.all(allMessages);

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