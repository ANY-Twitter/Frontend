import { createContext, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { BrowserRouter, Routes, Route, redirect, Navigate } from "react-router-dom";
import SignIn from "./components/SignIn";
import Twitter from "./components/Twitter";
import SendMessage from "./components/SendMessage";
import NotFound from "./components/NotFound";
import Messages from "./components/Messages";
import Home from "./components/Home";
import SignUp from "./components/SignUp";
import { UserContext } from "./components/Contexts";
import Config from "./components/Config";


function App() {

  const [user, setUser] = useState({keys:undefined});
  const [isLogged, setIsLogged] = useState(false);

  return (
    <BrowserRouter>
      <UserContext.Provider value={user}>
        <Routes>
          <Route path="/" element={isLogged && <Twitter />}>
            {
              isLogged ?  
              <>
              <Route path="home" element={<Home/>} />
              <Route path="send-message" element={<SendMessage/>} />
              <Route path="messages" element={<Messages/>} />
              <Route path="config" element={<Config setIsLogged={setIsLogged} setUser={setUser}/>}></Route>
              </> :

              <>
              <Route index element={<><NotFound redirection="sign-in"></NotFound></>}/>
              <Route path="sign-in" element={<SignIn setUser={setUser} setIsLogged={setIsLogged}/>} />
              <Route path="sign-up" element={<SignUp setUser={setUser} setIsLogged={setIsLogged}/>} />
              </>
            }
         </Route>
         <Route path="*" element={<NotFound redirection={isLogged ? '/home': '/sign-in'}/>} />
        </Routes>
      </UserContext.Provider>
    </BrowserRouter>
  );
}

export default App;
