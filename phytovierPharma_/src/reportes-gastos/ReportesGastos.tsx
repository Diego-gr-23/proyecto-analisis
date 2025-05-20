import React, { useState } from "react";
import "./ReportesGastos.css";
import { useNavigate } from "react-router-dom";
import pharmaImg from "../assets/pharma.png";

const ReportesGastos: React.FC = () => {
    const navigate = useNavigate();
    const [tipoGasto, setTipoGasto] = useState("Todos");
    const [mostrarReportesVendedor, setMostrarReportesVendedor] = useState(false);
    const [vendedorSeleccionado, setVendedorSeleccionado] = useState("Vendedor 1");

    const handleLogout = () => {
        navigate('/');
    };

    const handleMostrarReportes = () => {
        setMostrarReportesVendedor(true);
    };

    const handleVendedorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setVendedorSeleccionado(event.target.value);
    };

    const datosGrafica = vendedorSeleccionado === "Vendedor 1"
        ? ["20%", "40%", "60%", "65%", "80%", "95%"]
        : ["10%", "30%", "50%", "55%", "70%", "85%"];

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

            {/* Contenido de Reportes de Gastos */}
            <div className="gastos-container">
                {/* Gráfica simulada */}
                <div className="grafica">
                    {datosGrafica.map((altura, index) => (
                        <div
                            key={index}
                            className={`barra ${index % 2 === 0 ? "roja" : "gris"}`}
                            style={{ height: altura }}
                        ></div>
                    ))}
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
                            <select onChange={handleVendedorChange} value={vendedorSeleccionado}>
                                <option>Vendedor 1</option>
                                <option>Vendedor 2</option>
                            </select>
                        </div>
                    </div>

                    <div className="tipo-gastos">
                        <label>Tipo de gastos</label>
                        {/* Puedes agregar aquí un input si es necesario */}
                    </div>

                    <button onClick={handleMostrarReportes} className="btn-reportes-vendedor">
                        Reportes del vendedor seleccionado en la parte Usuarios
                    </button>

                    {mostrarReportesVendedor && (
                        <div className="reportes-vendedor">
                            <h3>Reportes del {vendedorSeleccionado}</h3>
                            <p>El vendedor Juan Perez de 30 medicamentos que se le dieron en una semana vendio 21 medicamentos <br/>
                            Lista de medicamentos vendidos por el vendedor <br/>
                            1. MeniPhib - 5 unidades - Q 100.00 <br/>
                            2. Argipoten - 3 unidades  - Q 105.00<br/>
                            3. Ajo Perejil - 2 unidades - Q 50.00<br/>
                            4. Metabolex fibra - 5 unidades - Q 100<br/>
                            5. Cartilageno - 3 unidades - Q 25.00<br/>
                            Siendo un total de 21 medicamentos vendidos y un total de Q 1490. 00</p>
                            Le hiceron falta 9 medicamentos para llegar a la meta de 30 medicamentos vendidos
                            {/* Puedes insertar aquí una tabla o componente de reportes reales */}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReportesGastos;
