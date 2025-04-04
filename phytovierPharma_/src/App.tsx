// src/App.tsx
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Inicio from './inicio/inicio' // Asegúrate de tener el componente Inicio importado
import Login from './login' // Asegúrate de tener el componente Login importado

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} /> {/* Ruta de Login */}
        <Route path="/inicio" element={<Inicio />} /> {/* Ruta del inicio/inicio */}
      </Routes>
    </Router>
  )
}

export default App
