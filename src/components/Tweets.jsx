import Tweet from "./Tweet";
import '../styles/Tweets.css'
import user_photo from "../img/test-username-photo.jpeg";
import { Link } from "react-router-dom";

function createSampleTweets(n){
    let colection = [];
    let dummy_data = {
        name:'Eric Bracamonte',
        handle: 'Ereiclo',
        data: `Lorem Ipsum is simply dummy text of the 
                printing and typesetting industry. Lorem Ipsum 
                has been the industry`,
        srcImg: user_photo, 
        isTweet:false,
    };

    for (let i = 0; i < n;++i){
        let actual_dummy_data = {...dummy_data};
        actual_dummy_data.id = i;
        colection.push(actual_dummy_data);
    }

    return colection;

}

function Tweets(props) {

    const sampleTweets = createSampleTweets(10);


    return (
        <div className="tweet-section">
        <div className="tweets">
            {
                sampleTweets.map((mess)=> {
                    return <Tweet key={mess.id} {...mess}/>;
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