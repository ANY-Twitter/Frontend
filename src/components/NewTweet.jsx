import { Link } from "react-router-dom";
import user_photo from "../img/test-username-photo.jpeg";
import '../styles/NewTweet.css'

function NewTweet(props){
    const {user} = props;



    return (
        <div className="modifiable-tweet">
            <div className="user-photo">
                <img src={user_photo} alt="" />
            </div>
            <div className="form-section">
                <form action="" novalidate>
                    <textarea name="new_tweet_data" id="new_tweet_data" cols="30" rows="10" placeholder="¿Qué estas pensando?"></textarea>
                    <Link className="button">Crear</Link>
                </form>
            </div>
        </div>
    )
}

export default NewTweet