import React from "react";
import "./Bodega.css";
import { useNavigate } from "react-router-dom";
import medicinaImg from '../assets/medicina.jpeg'; // Ajusta el path según tu estructura


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
                <div className="logo">Phytovier Pharma</div>
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

            {/*Box left*/}
            <div className="main-content">
                <div className="columna izquierda">
                    <div className="lista-productos">
                        <div className="item">Producto 1</div>
                        <div className="item">Producto 2</div>
                        <div className="item">Producto 3</div>
                        <div className="item">Producto 4</div>
                        <div className="item">Producto 5</div>
                        <div className="item">Producto 6</div>
                        <div className="item">Producto 7</div>
                        <div className="item">Producto 8</div>
                        <div className="item">Producto 9</div>
                        <div className="item">Producto 10</div>
                        <div className="item">Producto 11</div>
                        <div className="item">Producto 12</div>
                        <div className="item">Producto 13</div>
                        <div className="item">Producto 14</div>
                        <div className="item ver-mas">ver mas...</div>
                    </div>
                </div>

                {/*contenedor central*/}
                <div className="columna centro">
                    <div className="visor-productor">
                        <img src={medicinaImg} alt="Imagen del producto" className="imagen-producto" />
                    </div>
                    <textarea className="reporte" placeholder="Aca puede escribir un reporte del producto"></textarea>
                </div>


                {/*Box right*/}
                <div className="columna derecha">
                    <div className="encabezado-derecha">Lista de Productos a dar de baja</div>
                    <div className="item">Producto 1</div>
                    <div className="item">Producto 2</div>
                    <div className="item">Producto 3</div>
                    <div className="item">Producto 4</div>
                    <div className="item">Producto 5</div>

                    <div className="botones">
                        <button className="cancelar">Cancelar</button>
                        <button className="eliminar">Eliminar</button>
                    </div>
                </div>


            </div>
            


        </div>
    )
}

export default Dashboard