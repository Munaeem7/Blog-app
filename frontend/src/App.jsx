import React from 'react'
import {Routes , Route} from "react-router-dom"
import Home from './Pages/Home'


const App = () => {
  return (
    <div className='min-h-screen max-w-screen-lg'>
      
      <Routes>
        <Route path='/' element={< Home />}/>
      </Routes>
    </div>
  );
}

export default App
