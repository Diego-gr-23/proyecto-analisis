// src/components/RutaProtegida.tsx
import React, { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

interface RutaProtegidaProps {
  children: ReactNode
  rolesPermitidos: string[]
}

const RutaProtegida: React.FC<RutaProtegidaProps> = ({ children, rolesPermitidos }) => {
  const rol = localStorage.getItem('rol')
  const location = useLocation()

  if (!rol) {
    return <Navigate to="/" state={{ from: location }} replace />
  }

  if (!rolesPermitidos.includes(rol)) {
    return <Navigate to="/inicio" replace />
  }

  return <>{children}</>
}

export default RutaProtegida
