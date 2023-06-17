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
    const [fetchTweets, setFetchTweets] = useState([]);

    useEffect( () => {

        const fetchear = async () => {
            let coll = []
    
            let r = await fetch("http://localhost:8000/obtenerMensajes");
            let hexes = await r.json();

            for(let doc_i = 0; doc_i < hexes.length; doc_i++){
                hexes[doc_i]['hash'] = hexToBytes(hexes[doc_i]['hash'])
                hexes[doc_i]['signedHash'] = hexToBytes(hexes[doc_i]['signedHash'])
                hexes[doc_i]['message'] = hexToBytes(hexes[doc_i]['message'])
                console.log(hexes[doc_i])

                let final_message = await decrypt(user, hexes[doc_i]['message'], hexes[doc_i]['hash'] )
                console.log(final_message)
                if(final_message){

                    let r = await fetch("http://localhost:8000/getKeys/" + final_message.handle)
                    let jsonR  =await r.json()
                    
                    console.log(jsonR['sign_public'])
                    
                    let isValid = await verifyFirm(final_message.pt, hexes[doc_i]['signedHash'], jsonR['sign_public']);
                    
                    console.log(isValid)

                    if(isValid){
                        coll.push({
                            id: hexes[doc_i]['_id'],
                            name: final_message.handle,
                            handle: final_message.handle,
                            data: final_message.pt,
                            srcImg: user_photo,
                            isTweet: false,
                        });
                    }

                    
                    console.log(final_message);

                }
                
            }

            setFetchTweets(coll);
            console.log(fetchTweets)
            
        }

        fetchear();

    },[])

    // const sampleTweets = createSampleTweets(10);


    return (
        <div className="messages-section">
            <h2>Messages</h2>
            <Tweets tweets={fetchTweets}/>
            {/* <Tweets tweets={sampleTweets}/> */}
        </div>
    )


}


export default Messages;