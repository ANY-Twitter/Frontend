import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Inicio from './components/Inicio'
import Twitter from './components/Twitter'
import Messages from './components/Messages'
import NotFound from './components/NotFound'



function App() {
  let [user,setUser]  = useState({name:'Eric Bracamonte', handle:'Ereiclo'});
  

  return (
    <BrowserRouter>

      <Routes>
        <Route path='/home' element={<Twitter user={user} />}>
          <Route path='messages' element={<Messages/>}/>

        </Route> 
        <Route path='*' element={<NotFound/>}></Route>
      </Routes>

    </BrowserRouter>
  )
}

export default App
