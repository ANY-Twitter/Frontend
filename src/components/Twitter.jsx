import { Link, Outlet, useNavigate } from "react-router-dom";
import default_photo from "../img/default.jpg";
import "../styles/Twitter.css";
import { useContext, useEffect } from "react";
import { UserContext } from "./Contexts.jsx";

function Twitter(props) {
  const { setIsLogged, setUser } = props;

  const user = useContext(UserContext);
  const navegar = useNavigate();

  const signOut = () => {
    
    setIsLogged(false);
    setUser({keys:undefined})
  };

  return (
    <div className="twitter">
      <div className="menu">
        <div className="home-button">
          <Link to="/home">Home</Link>
        </div>
        <div className="user-section">
          {/* <img src={user.srcProfilePicture === '' ? default_photo : user.srcProfilePicture} alt="" /> */}
          <img src={default_photo} alt="" />
          <div className="user-info">
            <div className="name">{user.name}</div>
            <div className="handle">@{user.handle}</div>
          </div>
        </div>

        <div className="groups"></div>
        <div className="accesibility">
          <div className="messages-buttons">
            <Link className="button" to="messages">
              Ver Buzón
            </Link>
            <Link className="button" to="send-message">
              Enviar mensaje
            </Link>
          </div>
          <div className="sign-out">
            <Link className="button" onClick={signOut}>Cerrar Sesión</Link>
          </div>
        </div>
      </div>
      <Outlet />
    </div>
  );
}

export default Twitter;
