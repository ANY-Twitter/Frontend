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

export const userContext = createContext();
function App() {
  const [user, setUser] = useState(String());
  const [isLogged, setIsLogged] = useState(false);

  return (
    <BrowserRouter>
      <userContext.Provider value={[user, setUser]}>
        <Routes>
          <Route path="/" element={isLogged && <Twitter/>}>
            {
              isLogged ?  
              <>
              <Route path="home" element={<Home/>} />
              <Route path="send-message" element={<SendMessage/>} />
              <Route path="messages" element={<Messages/>} />
              </> :

              <>
              <Route index element={<><NotFound redirection="sign-in"></NotFound></>}/>
              <Route path="sign-in" element={<SignIn/>} />
              <Route path="sign-up" element={<SignUp />} />
              </>
            }
         </Route>
         <Route path="*" element={<NotFound redirection={isLogged ? '/home': '/sign-in'}/>} />
        </Routes>
      </userContext.Provider>
    </BrowserRouter>
  );
}

export default App;
