import React, { useState } from "react";
import "./ReportesGastos.css";
import { useNavigate } from "react-router-dom";

const ReportesGastos: React.FC = () => {
    const navigate = useNavigate();
    const [tipoGasto, setTipoGasto] = useState("Todos");

    const handleLogout = () => {
        navigate('/');
    };

    const handleTipoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTipoGasto(event.target.value);
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
                <button onClick={() => navigate('/Inicio')}>Inicio</button>
                <button onClick={() => navigate('/bodega/Bodega')}>Bodega</button>
                <button onClick={() => navigate('/ordenes-compra')}>Órdenes de Compra</button>
                <button onClick={() => navigate('/vendedores')}>Vendedores</button>
                <button onClick={() => navigate('/productos')}>Productos</button>
                <button onClick={() => navigate('/reportes-gastos')}>Reportes de Gastos</button>
                <button onClick={() => navigate('/configuracion')}>Configuración</button>
            </div>

            {/* Contenido de Reportes de Gastos */}
            <div className="gastos-container">
                {/* Gráfica simulada */}
                <div className="grafica">
                    <div className="barra roja" style={{ height: "60%" }}></div>
                    <div className="barra gris" style={{ height: "70%" }}></div>
                    <div className="barra roja" style={{ height: "50%" }}></div>
                    <div className="barra gris" style={{ height: "55%" }}></div>
                    <div className="barra roja" style={{ height: "90%" }}></div>
                    <div className="barra gris" style={{ height: "75%" }}></div>
                </div>

                {/* Filtros */}
                <div className="historial-filtros">
                    <h2>Historial de Gastos</h2>

                    <div className="filtros-row">
                        <div>
                            <label>Fecha Inicio</label>
                            <input type="date" defaultValue="2025-01-01" />
                        </div>
                        <div>
                            <label>Fecha Fin</label>
                            <input type="date" defaultValue="2025-12-01" />
                        </div>
                        <div>
                            <label>Usuarios</label>
                            <select>
                                <option>Usuarios</option>
                            </select>
                        </div>
                    </div>

                    <div className="tipo-gastos">
                        <label>Tipo de gastos</label>
                        <div className="radios">
                            <label>
                                <input
                                    type="radio"
                                    name="tipo"
                                    value="Todos"
                                    checked={tipoGasto === "Todos"}
                                    onChange={handleTipoChange}
                                />
                                Todos
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="tipo"
                                    value="Gastos Fijos"
                                    onChange={handleTipoChange}
                                />
                                Gastos Fijos
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="tipo"
                                    value="Gastos Variables"
                                    onChange={handleTipoChange}
                                />
                                Gastos Variables
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="tipo"
                                    value="Compra de Productos"
                                    onChange={handleTipoChange}
                                />
                                Compra de Productos
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportesGastos;
