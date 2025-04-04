// src/Login.tsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'  // Importar el hook useNavigate
import './login.css'

const Login: React.FC = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    
    // Aquí puedes agregar tu lógica de validación (por ejemplo, autenticación)
    if (username === 'admin' && password === 'password') {
      // Si la validación es exitosa, navega a la página de Inicio
      navigate('/inicio') // Redirige a la ruta /inicio
    } else {
      alert('Usuario o contraseña incorrectos.')
    }
  }

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Usuario:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        
        <label htmlFor="password">Contraseña:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        
        <button type="submit">Ingresar</button>
      </form>
    </div>
  )
}

export default Login

