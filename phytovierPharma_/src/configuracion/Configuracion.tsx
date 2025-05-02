import React, { useState } from 'react'
import './Configuracion.css'
import { useNavigate } from 'react-router-dom'

const Configuracion: React.FC = () => {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [language, setLanguage] = useState('es')
  const [notificaciones, setNotificaciones] = useState({ vencimiento: true, ordenes: true, gastos: false })
  const [empresa, setEmpresa] = useState({ nombre: 'Mi Empresa', direccion: 'Dirección', logo: '' })
  const [parametros, setParametros] = useState({ alertaVencimiento: 10, moneda: 'GTQ', corte: '15' })

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Contraseña cambiada exitosamente.')
    setPassword('')
    setNewPassword('')
  }

  const handleBackup = () => {
    alert('Respaldando base de datos... (simulado)')
  }

  const handleLogout = () => {
    navigate('/')
  }

  return (
    <div>
      {/* Header */}
      <div className="header">
        <div className="logo">LOGO</div>
        <div>
          <span>Administrador</span>
          <button onClick={handleLogout}>Salir</button>
          <input type="text" placeholder="Search" />
        </div>
      </div>

      {/* Menú */}
      <div className="menu">
        <button onClick={() => navigate('/Inicio')}>Inicio</button>
        <button onClick={() => navigate('/bodega/Bodega')}>Bodega</button>
        <button onClick={() => navigate('/ordenes-compra')}>Órdenes de Compra</button>
        <button onClick={() => navigate('/vendedores')}>Vendedores</button>
        <button onClick={() => navigate('/productos')}>Productos</button>
        <button onClick={() => navigate('/reportes-gastos')}>Reportes de Gastos</button>
        <button onClick={() => navigate('/configuracion')}>Configuración</button>
      </div>

      {/* Contenido de configuración */}
      <div className="config-container">
        <h2>Configuración del Sistema</h2>

        <form onSubmit={handlePasswordChange}>
          <h3>Cambiar Contraseña</h3>
          <input type="password" placeholder="Contraseña actual" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <input type="password" placeholder="Nueva contraseña" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
          <button type="submit">Guardar</button>
        </form>

        <h3>Permisos de Acceso</h3>
        <p>Configurar permisos por tipo de usuario (admin, vendedor, visitador médico)</p>
        <p style={{ fontSize: '0.9rem', fontStyle: 'italic' }}>[Este módulo sería editable por el administrador en un sistema real]</p>

        <h3>Notificaciones</h3>
        <label>
          <input type="checkbox" checked={notificaciones.vencimiento} onChange={(e) => setNotificaciones({ ...notificaciones, vencimiento: e.target.checked })} /> Alertas de vencimiento
        </label>
        <label>
          <input type="checkbox" checked={notificaciones.ordenes} onChange={(e) => setNotificaciones({ ...notificaciones, ordenes: e.target.checked })} /> Órdenes pendientes
        </label>
        <label>
          <input type="checkbox" checked={notificaciones.gastos} onChange={(e) => setNotificaciones({ ...notificaciones, gastos: e.target.checked })} /> Reportes de gastos
        </label>

        <h3>Respaldo del Sistema</h3>
        <button onClick={handleBackup}>Descargar respaldo</button>

        <h3>Idioma</h3>
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="es">Español</option>
          <option value="en">Inglés</option>
        </select>

        <h3>Datos de la Empresa</h3>
        <input type="text" value={empresa.nombre} onChange={(e) => setEmpresa({ ...empresa, nombre: e.target.value })} placeholder="Nombre de la empresa" />
        <input type="text" value={empresa.direccion} onChange={(e) => setEmpresa({ ...empresa, direccion: e.target.value })} placeholder="Dirección" />
        <input type="text" value={empresa.logo} onChange={(e) => setEmpresa({ ...empresa, logo: e.target.value })} placeholder="URL del logo" />

        <h3>Parámetros del Sistema</h3>
        <label>
          Alerta de vencimiento (%):
          <input type="number" value={parametros.alertaVencimiento} onChange={(e) => setParametros({ ...parametros, alertaVencimiento: Number(e.target.value) })} />
        </label>
        <label>
          Moneda:
          <input type="text" value={parametros.moneda} onChange={(e) => setParametros({ ...parametros, moneda: e.target.value })} />
        </label>
        <label>
          Día de corte:
          <input type="text" value={parametros.corte} onChange={(e) => setParametros({ ...parametros, corte: e.target.value })} />
        </label>
      </div>
    </div>
  )
}

export default Configuracion
