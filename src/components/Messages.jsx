import '../styles/Home.css'
import Tweets from "./Tweets";
import { Link } from "react-router-dom";
import user_photo from "../img/test-username-photo.jpeg";
import '../styles/Messages.css'
import { UserContext } from './Contexts.jsx';
import { useContext, useEffect, useState } from 'react';
import { decrypt, hexToBytes, verifyFirm } from '../util/crypto';

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

    useEffect( () => {

        let coll = []

        fetch("http://localhost:8000/obtenerMensajes")
        .then(r => r.json())
        .then(hexes => {
            // console.log(hexes)
            for(let doc_i = 0; doc_i < hexes.length; doc_i++){
                hexes[doc_i]['hash'] = hexToBytes(hexes[doc_i]['hash'])
                hexes[doc_i]['signedHash'] = hexToBytes(hexes[doc_i]['signedHash'])
                hexes[doc_i]['message'] = hexToBytes(hexes[doc_i]['message'])
                // console.log(hexes[doc_i])

                decrypt(user, hexes[doc_i]['message'], hexes[doc_i]['hash'] )
                .then(final_message => {
                    if(final_message){

                        fetch("http://localhost:8000/getKeys/" + final_message.handle)
                        .then(r => r.json())
                        .then(jsonR =>{
                            console.log('sign_public')
                            console.log(jsonR['sign_public'])
                            verifyFirm(final_message.pt, hexes[doc_i]['signedHash'], jsonR['sign_public'])
                            .then(isValid => {
                                console.log(isValid)

                                coll.push({
                                    id: hexes[doc_i]['_id'],
                                    name: final_message.handle,
                                    handle: final_message.handle,
                                    data: final_message.pt,
                                    srcImg: user_photo,
                                    isTweet: false,
                                })

                            });
                            console.log(final_message);

                        });
                    }
                })
            }

            setTweets(coll);
            console.log(tweets)
            // // [hash, message, signedHash]
            // for(let i = 0; i<hexes.length; i++){
            //     hexes[i] = hexToBytes(hexes[i])
            //     console.log(hexes[i])
            // }
            // console.log(hexes)

            // decrypt(user, hexes[1], hexes[0] )
            // .then(final_message => {
            //     if(final_message){
            //         verifyFirm(final_message.pt,hexes[2])
            //         .then(isValid => {
            //             console.log(isValid)
            //         });
            //         console.log(final_message);
            //     }
            // })
        })     
    },[])

    // const sampleTweets = createSampleTweets(10);


    return (
        <div className="messages-section">
            <h2>Messages</h2>
            <Tweets tweets={tweets}/>
            {/* <Tweets tweets={sampleTweets}/> */}
        </div>
    )


}


export default Messages;