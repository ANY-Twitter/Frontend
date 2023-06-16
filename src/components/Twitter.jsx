import { Link, Outlet, useNavigate } from "react-router-dom";
import user_photo from "../img/test-username-photo.jpeg";
import "../styles/Twitter.css";
import { useContext, useEffect } from "react";
import { UserContext } from "./Contexts.jsx";

function Twitter(props) {
  const { setIsLogged } = props;

  const user = useContext(UserContext);
  const navegar = useNavigate();

  const signOut = () => {
    setIsLogged(false);
  };

  return (
    <div className="twitter">
      <div className="menu">
        <div className="home-button">
          <Link to="/home">Home</Link>
        </div>
        <div className="user-section">
          <img src={user_photo} alt="" />
          <div className="user-info">
            {/* <div className="name">{user.name}</div> */}
            <div className="name">{user}</div>
            {/* <div className="handle">@{user.handle}</div> */}
            <div className="handle">@{user}</div>
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
