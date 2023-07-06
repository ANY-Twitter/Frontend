import '../styles/Home.css'
import default_photo from "../img/default.jpg";
import Tweets from "./Tweets";
import { Link } from "react-router-dom";
import user_photo from "../img/test-username-photo.jpeg";
import NewTweet from './NewTweet';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from './Contexts.jsx';



function Home() {
    const user = useContext(UserContext);


    const [tweets, setTweets] = useState([]);
    const load_tweets = async () => {

        const tweets_response = await fetch('http://localhost:8000/obtenerTweets');
        const tweets = await tweets_response.json();


        setTweets(tweets.map(({ id, data, usuario: [{ handle, name, pictureName }] }, index) => {
            console.log('La data es: ', data);
            console.log('El usuario es: ', name);
            console.log('El handle es: ', handle);
            console.log('La picture name es: ', pictureName);
            //const endPointImage ='';

            return { id, name, handle, data, srcImg: '' };

        }))



    }

    useEffect(() => {

        load_tweets();

    }, [])


    return (
        <div className="home-section">

            <h2>Home</h2>
            <div className="create-tweet">
                <NewTweet load_tweets={load_tweets}/>
            </div>
            <Tweets tweets={tweets} />
        </div>
    )


}


export default Home;