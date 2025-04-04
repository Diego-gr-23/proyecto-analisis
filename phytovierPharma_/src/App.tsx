// src/App.tsx
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Inicio from './inicio/Inicio' // Asegúrate de tener el componente Inicio importado
import Login from './login'
import Bodega from './bodega/Bodega' 
import OrdenesCompras from './ordenes-compras/OrdenesCompras' // Asegúrate de tener el componente OrdenesCompras importado
import Vendedores from './vendedores/Vendedores' // Asegúrate de tener el componente Vendedores importado
import Productos from './productos/Productos' // Asegúrate de tener el componente Productos importado
import ReportesGastos from './reportes-gastos/ReportesGastos' // Asegúrate de tener el componente ReportesGastos importado
import Configuracion from './configuracion/Configuracion' // Asegúrate de tener el componente Configuracion importado

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} /> {/* Ruta de Login */}
        <Route path="/inicio" element={<Inicio />} /> {/* Ruta del inicio/inicio */}
        <Route path="/bodega/Bodega" element={<Bodega />} />
        <Route path="/ordenes-compra" element={<OrdenesCompras />} /> {/* Ruta de Ordenes de Compra */}
        <Route path="/vendedores" element={<Vendedores />} /> {/* Ruta de Vendedores */}
        <Route path="/productos" element={<Productos />} /> {/* Ruta de Productos */}
        <Route path="/reportes-gastos" element={<ReportesGastos />} /> {/* Ruta de Reportes de Gastos */}
        <Route path="/configuracion" element={<Configuracion />} /> {/* Ruta de Configuración */}
      </Routes>
    </Router>
  )
}

export default App
