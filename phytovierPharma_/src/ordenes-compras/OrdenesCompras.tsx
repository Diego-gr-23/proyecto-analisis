import React from "react";
import "./OrdenesCompras.css";
import { useNavigate } from "react-router-dom";
import pharmaImg from "../assets/pharma.png";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

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
        <button onClick={() => navigate("/Inicio")}>Inicio</button>
        <button onClick={() => navigate("/bodega/Bodega")}>Bodega</button>
        <button onClick={() => navigate("/ordenes-compra")}>Órdenes de Compra</button>
        <button onClick={() => navigate("/vendedores")}>Vendedores</button>
        <button onClick={() => navigate("/reportes-gastos")}>Reportes de Gastos</button>
        <button onClick={() => navigate("/configuracion")}>Configuración</button>
      </div>

      {/* Contenido de Órdenes de Compra */}
      <div className="ordenes-container">
        <aside className="ordenes-list">
          {Array.from({ length: 14 }, (_, i) => (
            <button
              key={i}
              className={`orden-button ${i < 4 ? "highlighted" : ""}`}
            >
              Orden {i + 1}
            </button>
          ))}
          <button className="ver-mas">Ver más...</button>
        </aside>

        <section className="ordenes-grid">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="orden-card">
              <div className="image-placeholder" />
            </div>
          ))}
        </section>

        <aside className="vendedores-panel">
          <div className="vendedores-list">
            <div className="vendedores-title">Vendedores</div>
            <div className="vendedor highlighted">Vendedor 1</div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Dashboard;
