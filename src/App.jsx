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
import isLogged from "./util/isLogged";

export const userContext = createContext();

function App() {
  const [user, setUser] = useState(String());

  return (
    <BrowserRouter>
      <userContext.Provider value={[user, setUser]}>
        <Routes>
          <Route path="/" element={<Twitter/>}>
            <Route index element={isLogged(user) ? <Navigate replace to={'/home'}/> : <SignIn/>} />
            {/* <Route path='signup' element={<Signup/>}/> */}
            {/* <Route path='welcome' element={<Inicio/>}/> */}
            <Route path="home" element={isLogged(user)?<Home/>: <Navigate replace to={'/'}/>} />
            {/* <Route path="home" element={redirectSignIn(user, <Home/>)} /> */}
            <Route path="send-message" element={isLogged(user)?<SendMessage/>: <Navigate replace to={'/'}/>} />
            {/* <Route path="send-message" element={<SendMessage/>} /> */}
            <Route path="messages" element={isLogged(user)?<Messages/>: <Navigate replace to={'/'}/>} />
            {/* <Route path="messages" element={<Messages />} /> */}
            {/* <Route path="signup" element={isLogged(user)?<SignUp/>: <Navigate replace to={'/'}/>} /> */}
            <Route path="signup" element={isLogged(user) ? <Navigate replace to={'/home'}/> : <SignUp />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </userContext.Provider>
    </BrowserRouter>
  );
}

export default App;
