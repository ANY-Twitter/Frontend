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

            let currentLocalKeys = {};

            if (localStorage.getItem('savedKeys'))
                currentLocalKeys = JSON.parse(localStorage.getItem('savedKeys'));

            let allMessages = messages.map(async (elem) => {
                const signedHash = hexToBytes(elem.signedHash);
                const message = hexToBytes(elem.message);


                const final_message = await decrypt(user, message);


                if (final_message) {
                    // const githubUrl = `https://api.github.com/repos/${final_message.handle}/anytwitter/contents/public.json`;
                    const userFrom = findUser(allUsers, final_message.handle);
                    let keys = {};

                    if (!userFrom) {
                        return undefined;
                    }

                    // console.log('locales',currentLocalKeys);

                    if (currentLocalKeys[final_message.handle]) {
                        // console.log('locales2',currentLocalKeys);
                        keys = currentLocalKeys[final_message.handle];
                        console.log('cached');
                    }
                    else {
                        const githubUrl = `https://raw.githubusercontent.com/${final_message.handle}/anytwitter/main/public.json`
                        // const githubUrl = `https://api.github.com/repos/${final_message.handle}/anytwitter/contents/public.json`;

                        const respKeys = JSON.parse(userFrom.keys);

                        const verifier = await fetch(githubUrl,
                            {
                                headers: {
                                    // Authorization: "token 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"
                                },
                                cache: "no-store"
                            });
                        // const verifierKeys = JSON.parse(window.atob((await verifier.json()).content));
                        const verifierKeys = (await verifier.json());

                        if (verifier.status === 404 || JSON.stringify(verifierKeys) !== JSON.stringify(respKeys)) {
                            console.log('Failed user');
                            return undefined;
                        }

                        keys = respKeys;

                    }

                    const isValid = await verifyFirm(final_message.pt, signedHash, keys.sign);

                    if (isValid) {
                        console.log('este se desencripta', final_message);
                        console.log('este se desencripta', userFrom);
                        return {
                            id: elem.id,
                            name: userFrom.name,
                            handle: userFrom.handle,
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