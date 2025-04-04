import React from "react";
import "./ReportesGastos.css";
import { useNavigate } from "react-router-dom";

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



        </div>
    )
}

export default Dashboard