import { createContext, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Inicio from "./components/Inicio";
import Twitter from "./components/Twitter";
import SendMessage from "./components/SendMessage";
import NotFound from "./components/NotFound";
import Messages from "./components/Messages";
import Home from "./components/Home";

export const userContext = createContext();

function App() {
  let [user, setUser] = useState({
    name: "Eric Bracamonte",
    handle: "Ereiclo",
  });

  return (
    <BrowserRouter>
      <userContext.Provider value={[user, setUser]}>
        <Routes>
          <Route path="/" element={<Twitter/>}>
            <Route index element={<Inicio />} />
            {/* <Route path='signup' element={<Signup/>}/> */}
            {/* <Route path='welcome' element={<Inicio/>}/> */}
            <Route path="home" element={<Home/>} />
            <Route path="send-message" element={<SendMessage/>} />
            <Route path="messages" element={<Messages />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </userContext.Provider>
    </BrowserRouter>
  );
}

export default App;
