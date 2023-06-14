import '../styles/Home.css'
import Tweets from "./Tweets";
import { Link } from "react-router-dom";
import user_photo from "../img/test-username-photo.jpeg";
import NewTweet from './NewTweet';

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

function Home(props) {
    const {user} = props;

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