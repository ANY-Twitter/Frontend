import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Inicio from './components/Inicio'
import Twitter from './components/Twitter'
import SendMessage from './components/SendMessage'
import NotFound from './components/NotFound'
import Messages from './components/Tweets'



function App() {
  let [user,setUser]  = useState({name:'Eric Bracamonte', handle:'Ereiclo'});
  

  return (
    <BrowserRouter>

      <Routes>
        <Route path='/' element={<Twitter user={user} />}>
          <Route index element={<NotFound/>} />
          <Route path='home' element={<></>}/>
          <Route path='send-message' element={<SendMessage/>}/>
          <Route path='messages' element={<Messages/>}/>
        </Route> 
        <Route path='*' element={<NotFound/>}/>
      </Routes>

    </BrowserRouter>
  )
}

export default App
