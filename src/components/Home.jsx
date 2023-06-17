import '../styles/Home.css'
import default_photo from "../img/default.jpg";
import Tweets from "./Tweets";
import { Link } from "react-router-dom";
import user_photo from "../img/test-username-photo.jpeg";
import NewTweet from './NewTweet';
import { useContext } from 'react';
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


    return (
        <div className="home-section">

            <h2>Home</h2>
            <div className="create-tweet">
                <NewTweet/>
            </div>
            <Tweets tweets={sampleTweets}/>
        </div>
    )


}


export default Home;