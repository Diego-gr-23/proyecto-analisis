// src/Dashboard.tsx
import React from 'react'
import './Inicio.css'
import { useNavigate } from 'react-router-dom'
import pharmaImg from '../assets/pharma.png'
import medi_1 from '../assets/med_1.jpg'
import medi_2 from '../assets/med_2.jpg'
import medi_3 from '../assets/med_3.jpg'
import medi_4 from '../assets/med_4.jpg'
import medi_5 from '../assets/med_5.jpg'
import medi_6 from '../assets/med_6.jpg'
import medi_7 from '../assets/med_7.jpg'
import medi_8 from '../assets/med_8.jpg'
import medi_9 from '../assets/med_9.jpg'
import medi_10 from '../assets/med_10.jpg'
import medi_11 from '../assets/med_11.jpg'
import medi_12 from '../assets/med_12.jpg'
import medi_13 from '../assets/med_13.jpg'

const Dashboard: React.FC = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    // Aquí puedes agregar lógica de cierre de sesión si es necesario (por ejemplo, eliminar tokens de autenticación)
    navigate('/')  // Redirige al login
  }

  return (
    <div>
      {/* Header */}
      <div className="header">
        <div className="logo">
          <img src={pharmaImg} alt="Logo" className="logo-image" />
        </div>
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
        <button onClick={() => navigate('/reportes-gastos')}>Reportes de Gastos</button>
        <button onClick={() => navigate('/configuracion')}>Configuración</button>
      </div>

      {/* Contenido */}
      <div className="container">
        <div className="section">
          <h2>Productos próximos a vencer</h2>
          <div className="grid">
            <div><img src={medi_1} alt="medi1" className="medi_1" /></div><div><img src={medi_2} alt="medi2" className="medi_2" /></div>
            <div><img src={medi_3} alt="medi3" className="medi_3" /></div><div><img src={medi_4} alt="medi4" className="medi_4" /></div>
            <div><img src={medi_5} alt="medi5" className="medi_5" /></div><div><img src={medi_6} alt="medi6" className="medi_6" /></div>
            {/* <div><img src={medi_7} alt="medi7" className="medi_7" /></div><div><img src={medi_8} alt="medi8" className="medi_8" /></div> */}
          </div>
        </div>
        <div className="section">
          <h2>Productos más vendidos del mes</h2>
          <div className="grid">
            <div><img src={medi_9} alt="medi9" className="medi_9" /></div><div><img src={medi_10} alt="medi10" className="medi_10" /></div>
            <div><img src={medi_11} alt="medi11" className="medi_11" /></div><div><img src={medi_12} alt="medi12" className="medi_12" /></div>
            <div><img src={medi_13} alt="medi13" className="medi_13" /></div><div><img src={medi_6} alt="medi6" className="medi_6" /></div>
            {/* <div><img src={medi_7} alt="medi7" className="medi_7" /></div><div><img src={medi_8} alt="medi8" className="medi_8" /></div> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
