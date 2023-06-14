import { Link, Outlet } from "react-router-dom";
import user_photo from "../img/test-username-photo.jpeg";
import "../styles/Twitter.css";
import { useContext, useEffect } from "react";
import { userContext } from "../App";

function Twitter() {
  const [user, serUser] = useContext(userContext);

  return (
    <div className="twitter">
      <div className="menu">
        <div className="home-button">
          <Link to="/home">Home</Link>
        </div>
        <div className="user-section">
          <img src={user_photo} alt="" />
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
          <button>Cerrar Sesión</button>
          <div className="sign-out">
            <Link className="button">X</Link>
          </div>
        </div>
      </div>
      <Outlet />
    </div>
  );
}

export default Twitter;
