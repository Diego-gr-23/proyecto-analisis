import React, { useState, useEffect } from "react";
import "./OrdenesCompras.css";
import { useNavigate } from "react-router-dom";
import pharmaImg from "../assets/pharma.png";

interface Medicina {
  medicineId: string;
  nombreMedicina: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

interface OrdenCompra {
  _id: string;
  numeroOrden: string;
  descripcion: string;
  fechaCreacion: string;
  fechaEntrega: string;
  total: number;
  estado: string;
  medicinas: Medicina[];
  observaciones?: string;
  urgente: boolean;
}

interface Vendedor {
  _id: string;
  nombre: string;
  email: string;
}

interface VendedorConOrdenes {
  _id: string;
  vendedor: Vendedor;
  ordenes: OrdenCompra[];
  totalOrdenes: number;
  montoTotal: number;
  ordenesUrgentes?: number;
}

const OrdenesCompras: React.FC = () => {
  const navigate = useNavigate();
  const [vendedoresConOrdenes, setVendedoresConOrdenes] = useState<VendedorConOrdenes[]>([]);
  const [vendedorSeleccionado, setVendedorSeleccionado] = useState<string | null>(null);
  const [ordenSeleccionada, setOrdenSeleccionada] = useState<OrdenCompra | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrdenesPorVendedor();
  }, []);

  const fetchOrdenesPorVendedor = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:3000/ordenescompra/por-vendedor');
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data || data.length === 0) {
        // Si no hay datos, intentamos crear datos de muestra
        const initResponse = await fetch('http://localhost:3000/ordenescompra/init-data', {
          method: 'POST'
        });
        
        if (!initResponse.ok) {
          throw new Error('No hay datos disponibles y no se pudieron crear datos de muestra');
        }
        
        // Volvemos a intentar obtener los datos
        const newResponse = await fetch('http://localhost:3000/ordenescompra/por-vendedor');
        const newData = await newResponse.json();
        
        if (!newData || newData.length === 0) {
          throw new Error('No se pudieron cargar los datos después de la inicialización');
        }
        
        setVendedoresConOrdenes(newData);
        setVendedorSeleccionado(newData[0]._id);
      } else {
        setVendedoresConOrdenes(data);
        setVendedorSeleccionado(data[0]._id);
      }
    } catch (error) {
      console.error('Error al obtener órdenes:', error);
      setError(error instanceof Error ? error.message : String(error));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    navigate("/");
  };

  const getVendedorActual = () => {
    return vendedoresConOrdenes.find(v => v._id === vendedorSeleccionado);
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'entregada': return '#4CAF50';
      case 'procesando': return '#FF9800';
      case 'cancelada': return '#F44336';
      case 'aprobada': return '#2196F3';
      case 'enviada': return '#9C27B0';
      default: return '#607D8B';
    }
  };

  if (loading) {
    return <div className="loading">Cargando órdenes de compra...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error al cargar los datos</h2>
        <p>{error}</p>
        <button onClick={fetchOrdenesPorVendedor}>Reintentar</button>
      </div>
    );
  }

  const vendedorActual = getVendedorActual();

  return (
    <div className="ordenes-compra-container">
      {/* Header */}
      <div className="header">
        <div className="logo">
          <img src={pharmaImg} alt="Logo" className="logo-image" />
        </div>
        <div>
          <span>Administrador</span>
          <button onClick={handleLogout}>Salir</button>
          <input type="text" placeholder="Buscar..." />
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
        {/* Lista de Vendedores */}
        <aside className="vendedores-panel">
          <div className="vendedores-title">Vendedores</div>
          <div className="vendedores-list">
            {vendedoresConOrdenes.map((vendedorData) => (
              <div
                key={vendedorData._id}
                className={`vendedor ${vendedorSeleccionado === vendedorData._id ? 'selected' : ''}`}
                onClick={() => {
                  setVendedorSeleccionado(vendedorData._id);
                  setOrdenSeleccionada(null);
                }}
              >
                <div className="vendedor-info">
                  <div className="vendedor-nombre">{vendedorData.vendedor.nombre}</div>
                  <div className="vendedor-stats">
                    <span className="total-ordenes">{vendedorData.totalOrdenes} órdenes</span>
                    <span className="monto-total">${vendedorData.montoTotal.toFixed(2)}</span>
                    {vendedorData.ordenesUrgentes && vendedorData.ordenesUrgentes > 0 && (
                      <span className="urgentes-count">{vendedorData.ordenesUrgentes} urgentes</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Lista de Órdenes del Vendedor Seleccionado */}
        <aside className="ordenes-list">
          <div className="ordenes-title">
            {vendedorActual ? `Órdenes de ${vendedorActual.vendedor.nombre}` : 'Órdenes de Compra'}
          </div>
          {vendedorActual?.ordenes.map((orden) => (
            <button
              key={orden._id}
              className={`orden-button ${ordenSeleccionada?._id === orden._id ? "selected" : ""} ${orden.urgente ? "urgente" : ""}`}
              onClick={() => setOrdenSeleccionada(orden)}
            >
              <div className="orden-info">
                <div className="orden-numero">{orden.numeroOrden}</div>
                <div className="orden-fecha">{new Date(orden.fechaCreacion).toLocaleDateString()}</div>
                <div 
                  className="orden-estado"
                  style={{ color: getEstadoColor(orden.estado) }}
                >
                  {orden.estado.toUpperCase()}
                </div>
                <div className="orden-total">${orden.total.toFixed(2)}</div>
                {orden.urgente && <div className="urgente-badge">URGENTE</div>}
              </div>
            </button>
          ))}
        </aside>

        {/* Detalle de la Orden Seleccionada */}
        <section className="orden-detalle">
          {ordenSeleccionada ? (
            <div className="detalle-container">
              <div className="detalle-header">
                <h2>Orden {ordenSeleccionada.numeroOrden}</h2>
                <div className="header-right">
                  {ordenSeleccionada.urgente && <span className="urgente-badge-detalle">URGENTE</span>}
                  <div 
                    className="estado-badge"
                    style={{ backgroundColor: getEstadoColor(ordenSeleccionada.estado) }}
                  >
                    {ordenSeleccionada.estado.toUpperCase()}
                  </div>
                </div>
              </div>
              
              <div className="detalle-info">
                <div className="info-item">
                  <label>Descripción:</label>
                  <span>{ordenSeleccionada.descripcion}</span>
                </div>
                <div className="info-item">
                  <label>Fecha Creación:</label>
                  <span>{new Date(ordenSeleccionada.fechaCreacion).toLocaleDateString()}</span>
                </div>
                <div className="info-item">
                  <label>Fecha Entrega:</label>
                  <span>{new Date(ordenSeleccionada.fechaEntrega).toLocaleDateString()}</span>
                </div>
                <div className="info-item">
                  <label>Total:</label>
                  <span>${ordenSeleccionada.total.toFixed(2)}</span>
                </div>
                {ordenSeleccionada.observaciones && (
                  <div className="info-item full-width">
                    <label>Observaciones:</label>
                    <span>{ordenSeleccionada.observaciones}</span>
                  </div>
                )}
              </div>

              <div className="productos-section">
                <h3>Medicinas</h3>
                <div className="productos-list">
                  {ordenSeleccionada.medicinas.map((medicina, index) => (
                    <div key={`${medicina.medicineId}-${index}`} className="producto-item">
                      <div className="producto-nombre">{medicina.nombreMedicina}</div>
                      <div className="producto-cantidad">Cantidad: {medicina.cantidad}</div>
                      <div className="producto-precio">Precio unitario: ${medicina.precioUnitario.toFixed(2)}</div>
                      <div className="producto-subtotal">
                        Subtotal: ${medicina.subtotal.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="no-selection">
              <p>Selecciona una orden para ver los detalles</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default OrdenesCompras;