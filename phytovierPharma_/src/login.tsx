import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './login.css'

const Login: React.FC = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    // Agrega la clase 'login' al body solo mientras este componente esté activo
    document.body.classList.add('login')
    return () => {
      document.body.classList.remove('login')
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Simulación de acceso basado en usuario
    if (username === 'admin' && password === 'admin123') {
      navigate('/inicio') // Admin va a /inicio
    } else if (username === 'vendedor' && password === 'venta123') {
      navigate('/ventas') // Vendedor va a /ventas (puede ser cualquier ruta que definas)
    } else {
      alert('Usuario o contraseña incorrectos.')
    }
  }

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h2>Iniciar Sesión</h2>
        <label htmlFor="username">Usuario:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label htmlFor="password">Contraseña:</label>
        <input
          type="password"
          id="password"
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
