import Tweet from "./Tweet";
import '../styles/Tweets.css'
import { Link } from "react-router-dom";
import { useContext, useEffect } from "react";
import { decrypt, hexToBytes, verifyFirm } from "../util/crypto";
import { UserContext } from "./Contexts";


function Tweets(props) {
    
    const user = useContext(UserContext);

    useEffect( () => {
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

                                

                            });
                            console.log(final_message);

                        });
                    }
                })
            }
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
    }, [])
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