import React, { useState, useEffect, ChangeEvent } from "react";
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

// Nueva interfaz para medicinas de bodega
interface MedicinaBodega {
  _id: string;
  nombre: string;
  precio: number;
  proveedor: string;
  cantidad: number;
  descripcion?: string;
}

interface NewOrder {
  vendedorId: string;
  descripcion: string;
  fechaEntrega: string;
  observaciones: string;
  urgente: boolean;
  medicinas: {
    medicineId: string;
    nombreMedicina: string;
    cantidad: number;
    precioUnitario: number;
  }[];
}

const OrdenesCompras: React.FC = () => {
  const navigate = useNavigate();
  const [vendedoresConOrdenes, setVendedoresConOrdenes] = useState<VendedorConOrdenes[]>([]);
  const [vendedorSeleccionado, setVendedorSeleccionado] = useState<string | null>(null);
  const [ordenSeleccionada, setOrdenSeleccionada] = useState<OrdenCompra | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingOrder, setAddingOrder] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // Estados para medicinas de bodega
  const [medicinasBodega, setMedicinasBodega] = useState<MedicinaBodega[]>([]);
  const [loadingMedicinas, setLoadingMedicinas] = useState(false);
  const [searchMedicina, setSearchMedicina] = useState('');
  const [medicinasFiltradas, setMedicinasFiltradas] = useState<MedicinaBodega[]>([]);

  const [newOrder, setNewOrder] = useState<NewOrder>({
    vendedorId: '',
    descripcion: '',
    fechaEntrega: '',
    observaciones: '',
    urgente: false,
    medicinas: []
  });

  const [newMedicina, setNewMedicina] = useState({
    medicineId: '',
    nombreMedicina: '',
    cantidad: 0,
    precioUnitario: 0
  });

  useEffect(() => {
    fetchOrdenesPorVendedor();
  }, []);

  // Efecto para cargar medicinas cuando se abre el formulario
  useEffect(() => {
    if (showAddForm) {
      fetchMedicinasBodega();
    }
  }, [showAddForm]);

  // Efecto para filtrar medicinas por búsqueda
  useEffect(() => {
    if (searchMedicina.trim() === '') {
      setMedicinasFiltradas(medicinasBodega);
    } else {
      const search = searchMedicina.toLowerCase();
      const filtradas = medicinasBodega.filter(medicina =>
        (typeof medicina.nombre === "string" && medicina.nombre.toLowerCase().includes(search)) ||
        (typeof medicina.proveedor === "string" && medicina.proveedor.toLowerCase().includes(search))
      );
      setMedicinasFiltradas(filtradas);
    }
  }, [searchMedicina, medicinasBodega]);

  const fetchMedicinasBodega = async () => {
    try {
      setLoadingMedicinas(true);
      const response = await fetch('http://localhost:3000/medicine');
      
      if (!response.ok) {
        throw new Error('Error al cargar medicinas de bodega');
      }
      
      const data = await response.json();
      // Mapeo de campos para que coincidan con la interfaz del frontend
      const dataMapeada = data.map((med: any) => ({
        ...med,
        nombre: med.nombre ?? med.name ?? "",
        proveedor: med.proveedor ?? med.provider ?? "",
        precio: typeof med.precio === "number" ? med.precio : (typeof med.price === "number" ? med.price : 0),
      }));
      setMedicinasBodega(dataMapeada);
      setMedicinasFiltradas(dataMapeada);
    } catch (error) {
      console.error('Error al cargar medicinas:', error);
      alert('Error al cargar medicinas de bodega');
    } finally {
      setLoadingMedicinas(false);
    }
  };

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
        const initResponse = await fetch('http://localhost:3000/ordenescompra/init-data', {
          method: 'POST'
        });
        
        if (!initResponse.ok) {
          throw new Error('No hay datos disponibles y no se pudieron crear datos de muestra');
        }
        
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

  const handleOrderInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = event.target;
    
    if (type === 'checkbox') {
      const checked = (event.target as HTMLInputElement).checked;
      setNewOrder(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setNewOrder(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleMedicinaInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewMedicina(prev => ({
      ...prev,
      [name]: name === 'cantidad' ? parseFloat(value) || 0 : value
    }));
  };

  // Nueva función para seleccionar medicina de bodega
  const handleSelectMedicinaBodega = (medicina: MedicinaBodega) => {
    setNewMedicina({
      medicineId: medicina._id,
      nombreMedicina: medicina.nombre,
      cantidad: 1, // Cantidad por defecto
      precioUnitario: medicina.precio
    });
    setSearchMedicina(''); // Limpiar búsqueda
  };

  const handleAddMedicina = () => {
    if (newMedicina.medicineId && newMedicina.nombreMedicina && newMedicina.cantidad > 0 && newMedicina.precioUnitario > 0) {
      // Verificar que la medicina no esté ya agregada
      const medicineExists = newOrder.medicinas.some(med => med.medicineId === newMedicina.medicineId);
      
      if (medicineExists) {
        alert('Esta medicina ya ha sido agregada a la orden');
        return;
      }

      setNewOrder(prev => ({
        ...prev,
        medicinas: [...prev.medicinas, { ...newMedicina }]
      }));
      
      setNewMedicina({
        medicineId: '',
        nombreMedicina: '',
        cantidad: 0,
        precioUnitario: 0
      });
    } else {
      alert('Por favor selecciona una medicina y especifica la cantidad');
    }
  };

  const handleRemoveMedicina = (index: number) => {
    setNewOrder(prev => ({
      ...prev,
      medicinas: prev.medicinas.filter((_, i) => i !== index)
    }));
  };

  const calculateOrderTotal = () => {
    return newOrder.medicinas.reduce((total, medicina) => {
      return total + (medicina.cantidad * medicina.precioUnitario);
    }, 0);
  };

  const handleAddOrder = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!newOrder.vendedorId || !newOrder.descripcion || !newOrder.fechaEntrega || newOrder.medicinas.length === 0) {
      alert('Por favor completa todos los campos obligatorios y agrega al menos una medicina.');
      return;
    }

    try {
      setAddingOrder(true);

      const orderData = {
        vendedorId: newOrder.vendedorId,
        descripcion: newOrder.descripcion,
        fechaEntrega: newOrder.fechaEntrega,
        observaciones: newOrder.observaciones,
        urgente: newOrder.urgente,
        medicinas: newOrder.medicinas.map(med => ({
          medicineId: med.medicineId,
          nombreMedicina: med.nombreMedicina,
          cantidad: med.cantidad,
          precioUnitario: med.precioUnitario,
          subtotal: med.cantidad * med.precioUnitario
        })),
        total: calculateOrderTotal(),
        // Agrega estos dos campos:
        numeroOrden: Date.now().toString(), // o usa un generador de string único
        fechaCreacion: new Date() // Esto es un Date instance
      };

      const response = await fetch('http://localhost:3000/ordenescompra', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear la orden');
      }

      await fetchOrdenesPorVendedor();
      
      setNewOrder({
        vendedorId: '',
        descripcion: '',
        fechaEntrega: '',
        observaciones: '',
        urgente: false,
        medicinas: []
      });
      
      setShowAddForm(false);
      
      alert('Orden creada exitosamente');
      
    } catch (error) {
      console.error('Error al crear orden:', error);
      alert(error instanceof Error ? error.message : 'Error desconocido al crear orden');
    } finally {
      setAddingOrder(false);
    }
  };

  const handleCancelAddOrder = () => {
    setNewOrder({
      vendedorId: '',
      descripcion: '',
      fechaEntrega: '',
      observaciones: '',
      urgente: false,
      medicinas: []
    });
    setNewMedicina({
      medicineId: '',
      nombreMedicina: '',
      cantidad: 0,
      precioUnitario: 0
    });
    setSearchMedicina('');
    setShowAddForm(false);
  };

  const handleEliminarOrden = async (ordenId: string) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta orden?")) return;
    try {
      const response = await fetch(`http://localhost:3000/ordenescompra/${ordenId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("No se pudo eliminar la orden");
      await fetchOrdenesPorVendedor();
      setOrdenSeleccionada(null);
      alert("Orden eliminada");
    } catch (error) {
      alert("Error al eliminar la orden");
    }
  };

  const handleMarcarEntregada = async (ordenId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/ordenescompra/${ordenId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: "entregada" }),
      });
      if (!response.ok) throw new Error("No se pudo actualizar la orden");
      await fetchOrdenesPorVendedor();
      alert("Orden marcada como entregada");
    } catch (error) {
      alert("Error al actualizar la orden");
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

      <div className="menu">
        <button onClick={() => navigate("/Inicio")}>Inicio</button>
        <button onClick={() => navigate("/bodega/Bodega")}>Bodega</button>
        <button onClick={() => navigate("/ordenes-compra")}>Órdenes de Compra</button>
        <button onClick={() => navigate("/vendedores")}>Vendedores</button>
        <button onClick={() => navigate("/reportes-gastos")}>Reportes de Gastos</button>
        <button onClick={() => navigate("/configuracion")}>Configuración</button>
      </div>

      <div className="ordenes-container">
        {/* Panel de Vendedores */}
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

        {/* Panel de Lista de Órdenes */}
        <aside className="ordenes-list">
          <div className="ordenes-title">
            {vendedorActual ? `Órdenes de ${vendedorActual.vendedor.nombre}` : 'Órdenes de Compra'}
            <button 
              className="add-order-btn"
              onClick={() => setShowAddForm(true)}
            >
              + Nueva Orden
            </button>
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

        {/* Panel de Detalle de Orden */}
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
                  {/* Botón para marcar como entregada */}
                  {ordenSeleccionada.estado !== "entregada" && (
                    <button onClick={() => handleMarcarEntregada(ordenSeleccionada._id)}>
                      Marcar como Entregada
                    </button>
                  )}
                  {/* Botón para eliminar */}
                  <button onClick={() => handleEliminarOrden(ordenSeleccionada._id)}>
                    Eliminar Orden
                  </button>
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

        {/* Modal de Nueva Orden */}
        {showAddForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2>AGREGAR NUEVA ORDEN</h2>
                <button className="close-modal" onClick={() => setShowAddForm(false)}>
                  ×
                </button>
              </div>
              
              <form onSubmit={handleAddOrder}>
                <div className="form-group">
                  <label>Vendedor:</label>
                  <select 
                    name="vendedorId" 
                    value={newOrder.vendedorId}
                    onChange={handleOrderInputChange}
                    required
                  >
                    <option value="">Seleccionar vendedor</option>
                    {vendedoresConOrdenes.map((vendedorData) => (
                      <option key={vendedorData._id} value={vendedorData._id}>
                        {vendedorData.vendedor.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Descripción:</label>
                  <textarea
                    name="descripcion"
                    value={newOrder.descripcion}
                    onChange={handleOrderInputChange}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Fecha de Entrega:</label>
                    <input 
                      type="date" 
                      name="fechaEntrega" 
                      value={newOrder.fechaEntrega}
                      onChange={handleOrderInputChange}
                      required
                    />
                  </div>
                  <div className="form-group checkbox-container">
                    <label>
                      <input
                        type="checkbox"
                        name="urgente"
                        checked={newOrder.urgente}
                        onChange={handleOrderInputChange}
                      />
                      Orden Urgente
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <label>Observaciones:</label>
                  <textarea
                    name="observaciones"
                    value={newOrder.observaciones}
                    onChange={handleOrderInputChange}
                  />
                </div>

                <div className="medicinas-section">
                  <h3>Agregar Medicinas</h3>
                  
                  <div className="medicina-form">
                    {/* Campo de búsqueda de medicinas */}
                    <div className="medicina-search">
                      <input
                        type="text"
                        placeholder="Buscar medicina en bodega..."
                        value={searchMedicina}
                        onChange={(e) => setSearchMedicina(e.target.value)}
                      />
                      {loadingMedicinas && <span>Cargando medicinas...</span>}
                    </div>

                    {/* Lista de medicinas filtradas */}
                    {searchMedicina && Array.isArray(medicinasFiltradas) && medicinasFiltradas.length > 0 && (
                      <div className="medicinas-dropdown">
                        <div className="medicinas-list">
                          {medicinasFiltradas.slice(0, 10).map((medicina) => (
                            <div 
                              key={medicina._id} 
                              className="medicina-option"
                              onClick={() => handleSelectMedicinaBodega(medicina)}
                            >
                              <div className="medicina-info">
                                <span className="medicina-nombre">{medicina.nombre}</span>
                                <span className="medicina-precio">
                                  ${typeof medicina.precio === "number" ? medicina.precio.toFixed(2) : "0.00"}
                                </span>
                                <span className="medicina-proveedor">Proveedor: {medicina.proveedor}</span>
                                <span className="medicina-stock">Stock: {medicina.cantidad}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Medicina seleccionada */}
                    {newMedicina.nombreMedicina && (
                      <div className="medicina-selected">
                        <div className="selected-info">
                          <span><strong>{newMedicina.nombreMedicina}</strong></span>
                          <span>Precio: ${newMedicina.precioUnitario.toFixed(2)}</span>
                        </div>
                        <input
                          type="number"
                          placeholder="Cantidad"
                          name="cantidad"
                          value={newMedicina.cantidad || ''}
                          onChange={handleMedicinaInputChange}
                          min="1"
                        />
                        <button type="button" onClick={handleAddMedicina}>
                          Agregar a Orden
                        </button>
                      </div>
                    )}
                  </div>

                  {newOrder.medicinas.length > 0 && (
                    <div className="medicinas-agregadas">
                      <h4>Medicinas en la orden:</h4>
                      {newOrder.medicinas.map((medicina, index) => (
                        <div key={index} className="medicina-item">
                          <span>{medicina.nombreMedicina}</span>
                          <span>Cantidad: {medicina.cantidad}</span>
                          <span>Precio: ${medicina.precioUnitario.toFixed(2)}</span>
                          <span>Subtotal: ${(medicina.cantidad * medicina.precioUnitario).toFixed(2)}</span>
                          <button 
                            type="button" 
                            onClick={() => handleRemoveMedicina(index)}
                            className="remove-btn"
                          >
                            Eliminar
                          </button>
                        </div>
                      ))}
                      <div className="total-orden">
                        <strong>Total de la orden: ${calculateOrderTotal().toFixed(2)}</strong>
                      </div>
                    </div>
                  )}
                </div>

                <div className="form-buttons">
                  <button 
                    type="button" 
                    className="cancel-btn" 
                    onClick={handleCancelAddOrder}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="submit-btn"
                    disabled={addingOrder}
                  >
                    {addingOrder ? 'Creando...' : 'Crear Orden'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdenesCompras;