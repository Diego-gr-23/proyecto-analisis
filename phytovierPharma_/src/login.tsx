import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './login.css'

const Login: React.FC = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const rol = localStorage.getItem('rol')

    // Redirigir a /inicio solo si hay sesión activa y no venimos de un logout
    if (rol && location.pathname === '/') {
      navigate('/inicio')
    }

    document.body.classList.add('login')
    return () => {
      document.body.classList.remove('login')
    }
  }, [navigate, location])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem('rol', 'admin')
      navigate('/inicio')
    } else if (username === 'vendedor' && password === 'venta123') {
      localStorage.setItem('rol', 'vendedor')
      navigate('/inicio')
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
