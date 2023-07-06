import { Link } from "react-router-dom";
import default_photo from "../img/default.jpg";
import user_photo from "../img/test-username-photo.jpeg";
import '../styles/NewTweet.css'
import './Contexts.jsx'
import { useContext, useState } from "react";
import { UserContext } from "./Contexts.jsx";

function NewTweet({load_tweets}){

    const [tweetData,setTweetData] = useState("");
    const user = useContext(UserContext);

    const updateTweetData = (e) => {
        setTweetData(e.currentTarget.value);
    }

    const submit = async (e) => {
        e.preventDefault();


        const response = await fetch('http://127.0.0.1:8000/tweet',{
            method: 'POST',
            body: JSON.stringify({
                data: tweetData,
                handle: user.handle,
                date: new Date().toISOString(),
            }),
            headers: {
                "Content-Type" : "application/json"
            }
        });

        load_tweets();
    }



    return (
        <div className="modifiable-tweet">
            <div className="user-photo">
                <img src={default_photo} alt="" />
            </div>
            <div className="form-section">
                <form action="" noValidate onSubmit={submit}>
                    <textarea onChange={(e) => updateTweetData(e) } value={tweetData} name="new_tweet_data" id="new_tweet_data" cols="30" rows="10" placeholder="¿Qué estas pensando?"></textarea>
                    <button className="button">Crear</button>
                </form>
            </div>
        </div>
    )
}

export default NewTweet