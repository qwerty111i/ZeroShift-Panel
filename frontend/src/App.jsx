import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import './App.css'

import Signup from './pages/Signup/Signup';
import Login from './pages/Login/Login';

function App() {
  const [count, setCount] = useState(0)

  return (
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  )
}

export default App
