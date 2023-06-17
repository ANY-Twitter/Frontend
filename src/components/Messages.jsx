import '../styles/Home.css'
import Tweets from "./Tweets";
import { Link, json } from "react-router-dom";
import user_photo from "../img/test-username-photo.jpeg";
import '../styles/Messages.css'
import { UserContext } from './Contexts.jsx';
import { useContext, useEffect, useState } from 'react';
import { decrypt, hexToBytes, verifyFirm  } from '../util/crypto';

function createSampleTweets(n) {
    let colection = [];
    let dummy_data = {
        name: 'Eric Bracamonte',
        handle: 'Ereiclo',
        data: `Lorem Ipsum is simply dummy text of the 
                printing and typesetting industry. Lorem Ipsum 
                has been the industry`,
        srcImg: user_photo,
        isTweet: false,
    };

    for (let i = 0; i < n; ++i) {
        let actual_dummy_data = { ...dummy_data };
        actual_dummy_data.id = i;
        colection.push(actual_dummy_data);
    }

    return colection;

}

function Messages(props) {

    const user = useContext(UserContext);
    const [tweets, setTweets] = useState([]);

    useEffect(  () => {

        const getTwets = async () => {

            const messages_resp = await fetch("http://localhost:8000/obtenerMensajes");
            const messages = await messages_resp.json();

            messages.forEach(async (elem) => {
                const hash = hexToBytes(elem.hash);
                const signedHash = hexToBytes(elem.signedHash);
                const message = hexToBytes(elem.message);

                const final_message = await decrypt(user,message,hash);

                if(final_message){
                    const keys_resp = await fetch("http://localhost:8000/getKeys/" + final_message.handle);
                    const keys = await keys_resp.json();
                    const isValid = await verifyFirm(final_message.pt,signedHash,keys.sign_public);

                    if (isValid) setTweets([
                        ...tweets,
                        {
                            id: elem._id,
                            name: final_message.name,
                            handle: final_message.handle,
                            data: final_message.pt,
                            srcImg: user_photo,
                            isTweet: false,
                        }
                    ]

                    )
                }
            })

        }

        getTwets();
       
    }, [])

    // const sampleTweets = createSampleTweets(10);


    return (
        <div className="messages-section">
            <h2>Messages</h2>
            <Tweets tweets={tweets} />
            {/* <Tweets tweets={sampleTweets}/> */}
        </div>
    )


}


export default Messages;