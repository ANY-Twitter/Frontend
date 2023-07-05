import '../styles/Home.css'
import default_photo from "../img/default.jpg";
import Tweets from "./Tweets";
import { Link } from "react-router-dom";
import user_photo from "../img/test-username-photo.jpeg";
import NewTweet from './NewTweet';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from './Contexts.jsx';

function createSampleTweets(n) {
    let colection = [];
    let dummy_data = {
        name: 'Eric Bracamonte',
        handle: 'Ereiclo',
        data: `Lorem Ipsum is simply dummy text of the 
                printing and typesetting industry. Lorem Ipsum 
                has been the industry Lorem Ipsum is simply dummy text of the 
                printing and typesetting industry. `,
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

function Home() {
    const user = useContext(UserContext);

    const sampleTweets = createSampleTweets(10);
    const [tweets,setTweets] = useState([]);

    useEffect(()=>{
        const load_tweets = async () =>{

            console.log('aaa')
            const tweets_response = await fetch('http://localhost:8000/obtenerTweets');
            const tweets = await tweets_response.json();


            setTweets(tweets.map(({id,data,usuario: [{handle,name,pictureName}]},index) => {
                console.log('La data es: ',data);
                console.log('El usuario es: ',name);
                console.log('El handle es: ',handle);
                console.log('La picture name es: ',pictureName);
                //const endPointImage ='';

                return {id,name,handle,data,srcImg:''};

            }))


 
        }

        load_tweets();
       

        


    },[])


    return (
        <div className="home-section">

            <h2>Home</h2>
            <div className="create-tweet">
                <NewTweet/>
            </div>
            <Tweets tweets={tweets}/>
        </div>
    )


}


export default Home;