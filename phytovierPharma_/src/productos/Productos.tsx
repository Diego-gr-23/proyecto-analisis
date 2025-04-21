import React from "react";
import "./productos.css";
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
        <button onClick={() => navigate("/productos")}>Productos</button>
        <button onClick={() => navigate("/reportes-gastos")}>Reportes de Gastos</button>
        <button onClick={() => navigate("/configuracion")}>Configuración</button>
      </div>

      {/* Contenido de Vendedores */}
      <div className="productos-container">
        {/* Sección Agregar */}
        <div className="panel">
          <h2 className="panel-title">AGREGAR NUEVOS PRODUCTOS</h2>
          <form className="formulario">
            <label>Nombre de Producto:</label>
            <input type="text" />
            <label>Fecha de Vencimiento:</label>
            <input type="text" />
            <label>Marca:</label>
            <input type="text" />
            <label>Laboratorio:</label>
            <input type="text" />
            <label>Codigo de barras:</label>
            <input type="text" />
            <div className="imagen-vendedor">
              <div className="image-placeholder"></div>
              <p>Imagen del producto nuevo</p>
            </div>
            <div className="form-buttons">
              <button type="button" className="cancelar">Cancelar</button>
              <button type="submit" className="agregar">Agregar</button>
            </div>
          </form>
        </div>

        {/* Sección Editar */}
        <div className="panel">
          <h2 className="panel-title">EDITAR PRODUCTOS</h2>
          <div className="scrollable-productos">
            {[1, 2, 3].map((i) => (
              <div key={i} className="vendedor-edit">
                <div className="image-placeholder" />
                <p>PRODUCTO {i}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sección Eliminar */}
        <div className="panel">
          <h2 className="panel-title">ELIMINAR PRODUCTO</h2>
          <div className="scrollable-vendedores">
            {[1, 2, 3].map((i) => (
              <div key={i} className="vendedor-edit">
                <div className="image-placeholder" />
                <p>PRODUCTO {i}</p>
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
