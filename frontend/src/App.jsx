import { Routes, Route } from 'react-router-dom';
import './App.css'

import Login from './pages/Login/Login';
import Panel from './pages/Panel/Panel.jsx';
import Admin from './pages/Admin/Admin.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route
          path="/panel"
          element={
            <ProtectedRoute>
              <Panel />
            </ProtectedRoute>
          }
      />
      <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
      />
    </Routes>
  )
}

export default App
