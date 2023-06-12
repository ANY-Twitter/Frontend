import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Inicio from './components/Inicio'
import Twitter from './components/Twitter'


function App() {
  let [user,setUser]  = useState({name:'Eric Bracamonte', handle:'Ereiclo'});
  

  return (
    <BrowserRouter>

      <Routes>
        <Route path='/' element={<Twitter user={user} />}>
          <Route index path='' element={<div>aaa</div>}/>

        </Route> 
      </Routes>

    </BrowserRouter>
  )
}

export default App
