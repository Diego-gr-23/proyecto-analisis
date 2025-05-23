// // src/App.tsx
// import React from 'react'
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
// import Inicio from './inicio/Inicio' // Asegúrate de tener el componente Inicio importado
// import Login from './login'
// import Bodega from './bodega/Bodega' 
// import OrdenesCompras from './ordenes-compras/OrdenesCompras' // Asegúrate de tener el componente OrdenesCompras importado
// import Vendedores from './vendedores/Vendedores' // Asegúrate de tener el componente Vendedores importado
// import ReportesGastos from './reportes-gastos/ReportesGastos' // Asegúrate de tener el componente ReportesGastos importado
// import Configuracion from './configuracion/Configuracion' // Asegúrate de tener el componente Configuracion importado

// const App: React.FC = () => {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Login />} /> {/* Ruta de Login */}
//         <Route path="/inicio" element={<Inicio />} /> {/* Ruta del inicio/inicio */}
//         <Route path="/bodega/Bodega" element={<Bodega />} />
//         <Route path="/ordenes-compra" element={<OrdenesCompras />} /> {/* Ruta de Ordenes de Compra */}
//         <Route path="/vendedores" element={<Vendedores />} /> {/* Ruta de Vendedores */}
//         <Route path="/reportes-gastos" element={<ReportesGastos />} /> {/* Ruta de Reportes de Gastos */}
//         <Route path="/configuracion" element={<Configuracion />} /> {/* Ruta de Configuración */}
//       </Routes>
//     </Router>
//   )
// }

// export default App

// src/App.tsx
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Inicio from './inicio/Inicio'
import Login from './login'
import Bodega from './bodega/Bodega'
import OrdenesCompras from './ordenes-compras/OrdenesCompras'
import Vendedores from './vendedores/Vendedores'
import ReportesGastos from './reportes-gastos/ReportesGastos'
import Configuracion from './configuracion/Configuracion'
import RutaProtegida from './RutaProtegida' 

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Ruta pública */}
        <Route path="/" element={<Login />} />

        {/* Rutas para admin y vendedor */}
        <Route
          path="/inicio"
          element={
            <RutaProtegida rolesPermitidos={['admin', 'vendedor']}>
              <Inicio />
            </RutaProtegida>
          }
        />

        <Route
          path="/ordenes-compra"
          element={
            <RutaProtegida rolesPermitidos={['admin', 'vendedor']}>
              <OrdenesCompras />
            </RutaProtegida>
          }
        />

        {/* Rutas solo para admin */}
        <Route
          path="/bodega/Bodega"
          element={
            <RutaProtegida rolesPermitidos={['admin']}>
              <Bodega />
            </RutaProtegida>
          }
        />
        <Route
          path="/vendedores"
          element={
            <RutaProtegida rolesPermitidos={['admin']}>
              <Vendedores />
            </RutaProtegida>
          }
        />
        <Route
          path="/reportes-gastos"
          element={
            <RutaProtegida rolesPermitidos={['admin']}>
              <ReportesGastos />
            </RutaProtegida>
          }
        />
        <Route
          path="/configuracion"
          element={
            <RutaProtegida rolesPermitidos={['admin']}>
              <Configuracion />
            </RutaProtegida>
          }
        />
      </Routes>
    </Router>
  )
}

export default App
