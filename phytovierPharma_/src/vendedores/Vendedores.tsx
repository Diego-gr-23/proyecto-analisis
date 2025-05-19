import React from "react";
import "./vendedores.css";
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

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
        <button onClick={() => navigate("/Inicio")}>Inicio</button>
        <button onClick={() => navigate("/bodega/Bodega")}>Bodega</button>
        <button onClick={() => navigate("/ordenes-compra")}>Órdenes de Compra</button>
        <button onClick={() => navigate("/vendedores")}>Vendedores</button>
        <button onClick={() => navigate("/reportes-gastos")}>Reportes de Gastos</button>
        <button onClick={() => navigate("/configuracion")}>Configuración</button>
      </div>

      {/* Contenido de Vendedores */}
      <div className="vendedores-container">
        {/* Sección Agregar */}
        <div className="panel">
          <h2 className="panel-title">AGREGAR NUEVOS VENDEDORES</h2>
          <form className="formulario">
            <label>Nombre:</label>
            <input type="text" />
            <label>Apellido:</label>
            <input type="text" />
            <label>No. Celular</label>
            <input type="text" />
            <label>Dpi</label>
            <input type="text" />
            <label>Dirección</label>
            <input type="text" />
            <div className="imagen-vendedor">
              <div className="image-placeholder"></div>
              <p>Imagen del vendedor nuevo</p>
            </div>
            <div className="form-buttons">
              <button type="button" className="cancelar">Cancelar</button>
              <button type="submit" className="agregar">Agregar</button>
            </div>
          </form>
        </div>

        {/* Sección Editar */}
        <div className="panel">
          <h2 className="panel-title">EDITAR VENDEDORES</h2>
          <div className="scrollable-vendedores">
            {[1, 2, 3].map((i) => (
              <div key={i} className="vendedor-edit">
                <div className="image-placeholder" />
                <p>VENDEDOR {i}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sección Eliminar */}
        <div className="panel">
          <h2 className="panel-title">ELIMINAR VENDEDOR</h2>
          <div className="scrollable-vendedores">
            {[1, 2, 3].map((i) => (
              <div key={i} className="vendedor-edit">
                <div className="image-placeholder" />
                <p>vendedor {i}</p>
              </div>
            ))}
          </div>
          <div className="form-buttons">
            <button className="cancelar">Cancelar</button>
            <button className="eliminar">Eliminar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
