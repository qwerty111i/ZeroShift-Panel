import { Routes, Route } from 'react-router-dom';
import './App.css'

import Signup from './pages/Signup/Signup';
import Login from './pages/Login/Login';
import Panel from './pages/Panel/Panel.jsx';

function App() {
  return (
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/" element={<Login />} />
      <Route path="/panel" element={<Panel />} />
    </Routes>
  )
}

export default App
