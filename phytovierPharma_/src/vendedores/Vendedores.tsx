import React, {useState, useEffect} from "react";
import "./vendedores.css";
import { useNavigate } from "react-router-dom";
import medicinaImg from '../assets/medicina.jpeg';
import pharmaImg from "../assets/pharma.png";

interface Vendedor {
    _id?: string;
    nombre: string;
    numeroCelular: number;
    dpi: string;
    descripcion?: string;
}

const Vendedores: React.FC = () => {
    const navigate = useNavigate();
    const [vendedores, setVendedores] = useState<Vendedor[]>([]);
    const [vendedoresToDelete, setVendedoresToDelete] = useState<Vendedor[]>([]);
    const [selectedVendedor, setSelectedVendedor] = useState<Vendedor | null>(null);
    const [descripcion, setDescripcion] = useState("");
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [displayCount, setDisplayCount] = useState(14); // Número inicial de vendedores a mostrar
    
    // Estados para el formulario de nuevo vendedor
    const [newVendedor, setNewVendedor] = useState<Vendedor>({
        nombre: "",
        numeroCelular: 0,
        dpi: ""
    });
    const [addingVendedor, setAddingVendedor] = useState(false);

    useEffect(() => {
        const fetchVendedores = async () => {
            try {
                setLoading(true);
                // Note: Updating to use the proper 'vendedores' endpoint
                const url = searchTerm 
                    ? `http://localhost:3000/vendedores?dpi=${searchTerm}`
                    : 'http://localhost:3000/vendedores';

                const response = await fetch(url);
                
                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }
                
                const result = await response.json();
                
                // Handle response structure
                const vendedoresData = result.data || result;
                
                console.log("Datos recibidos:", vendedoresData); // Log para debug
                
                setVendedores(Array.isArray(vendedoresData) ? vendedoresData : []);
                
            } catch (error) {
                console.error("Error al cargar vendedores:", error);
                setVendedores([]); // Asegura que vendedores sea un array vacío en caso de error
            } finally {
                setLoading(false);
            }
        };

        fetchVendedores();
    }, [searchTerm]);

    const handleLogout = () => {
        navigate('/');
    };

    const handleSelectVendedor = (vendedor: Vendedor) => {
        setSelectedVendedor(vendedor);
        setDescripcion(vendedor.descripcion || "");
    };

    const handleMarkForDeletion = (vendedor: Vendedor) => {
        if (!vendedoresToDelete.some(v => v.dpi === vendedor.dpi)) {
            setVendedoresToDelete([...vendedoresToDelete, vendedor]);
        }
    };

    const handleDeleteMarked = async () => {
        try {
            await Promise.all(
                vendedoresToDelete.map(vendedor => 
                    fetch(`http://localhost:3000/vendedores/${vendedor.dpi}`, {
                        method: 'DELETE'
                    })
                )
            );

            // Actualizar la lista después de eliminar
            const updatedVendedores = vendedores.filter(v => !vendedoresToDelete.some(vd => vd.dpi === v.dpi));
            setVendedores(updatedVendedores);
            setVendedoresToDelete([]);
            
            if (selectedVendedor && vendedoresToDelete.some(v => v.dpi === selectedVendedor.dpi)) {
                setSelectedVendedor(null);
            }
            
            alert('Vendedores eliminados con éxito');
        } catch (error) {
            console.error("Error al eliminar vendedores:", error);
            alert('Error al eliminar vendedores');
        }
    };

    const handleSaveDescripcion = async () => {
        if (!selectedVendedor) return;

        try {
            const response = await fetch(`http://localhost:3000/vendedores/${selectedVendedor.dpi}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ descripcion: descripcion }),
            });
            
            if (!response.ok) {
                throw new Error('Error al guardar la descripción');
            }
            
            // Actualizar el vendedor en la lista local
            const updatedVendedores = vendedores.map(v => 
                v.dpi === selectedVendedor.dpi ? { ...v, descripcion: descripcion } : v
            );
            
            setVendedores(updatedVendedores);
            alert('Descripción guardada con éxito');
        } catch (error) {
            console.error("Error al guardar descripción:", error);
            alert('Error al guardar la descripción');
        }
    };
    
    const handleShowMore = () => {
        // Incrementar el número de vendedores mostrados
        const remainingItems = vendedores.length - displayCount;
        if (remainingItems <= 10) {
            setDisplayCount(vendedores.length);
        } else {
            setDisplayCount(displayCount + 10);
        }
    };
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewVendedor({
            ...newVendedor,
            [name]: name === 'numeroCelular' ? parseFloat(value) || 0 : value
        });
    };
    
    const handleAddVendedor = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!newVendedor.nombre || !newVendedor.dpi) {
            alert("Por favor ingrese al menos el nombre y DPI del vendedor");
            return;
        }
        
        setAddingVendedor(true);
        
        try {
            const response = await fetch('http://localhost:3000/vendedores', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombre: newVendedor.nombre,
                    numeroCelular: newVendedor.numeroCelular,
                    dpi: Number(newVendedor.dpi),
                    descripcion: ""
                }),
            });
            
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.message || 'Error al agregar el vendedor');
            }
            
            // Añadir el nuevo vendedor a la lista
            const nuevoVendedor = result.data || result;
            setVendedores([...vendedores, nuevoVendedor]);
            
            setNewVendedor({
                nombre: "",
                numeroCelular: 0,
                dpi: "",
            });
            
            alert("Vendedor agregado con éxito");
        } catch (error) {
            console.error("Error al agregar vendedor:", error);
            if (error instanceof Error) {
                alert(error.message || "Error al agregar vendedor. Por favor, inténtelo de nuevo.");
            } else {
                alert("Error al agregar vendedor. Por favor, inténtelo de nuevo.");
            }
        } finally {
            setAddingVendedor(false);
        }
    };
    
    const handleCancelAddVendedor = () => {
        setNewVendedor({
            nombre: "",
            numeroCelular: 0,
            dpi: ""
        });
    };

    return ( 
        <div className="bodega-container">
            <div className="header">
                <div className="logo">
                    <img src={pharmaImg} alt="Logo" className="logo-image" />
                </div>
                <div className="header-actions">
                    <span>Administrador</span>
                    <button onClick={handleLogout}>Salir</button>
                    <input 
                        type="text" 
                        placeholder="Buscar por DPI..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="menu">
                <button onClick={() => navigate('/Inicio')}>Inicio</button>
                <button onClick={() => navigate('/bodega/Bodega')}>Bodega</button>
                <button onClick={() => navigate('/ordenes-compra')}>Órdenes de Compra</button>
                <button onClick={() => navigate('/vendedores')}>Vendedores</button>
                <button onClick={() => navigate('/reportes-gastos')}>Reportes de Gastos</button>
                <button onClick={() => navigate('/configuracion')}>Configuración</button>
            </div>

            <div className="bodega-content">
                <div className="columna izquierda">
                    <h2>LISTA DE VENDEDORES ({vendedores.length})</h2>
                    <div className="lista-medicamentos">
                        {loading ? (
                            <div className="loading">Cargando vendedores...</div>
                        ) : vendedores.length === 0 ? (
                            <div className="no-medicines">No se encontraron vendedores</div>
                        ) : (
                            <>
                                {vendedores.slice(0, displayCount).map((vendedor) => (
                                    <div 
                                        key={vendedor.dpi} 
                                        className={`item ${selectedVendedor?.dpi === vendedor.dpi ? 'seleccionado' : ''}`}
                                        onClick={() => handleSelectVendedor(vendedor)}
                                    >
                                        <div className="medicine-name">{vendedor.nombre}</div>
                                        <div className="medicine-price">DPI: {vendedor.dpi}</div>
                                    </div>
                                ))}
                                {vendedores.length > displayCount && (
                                    <div className="item ver-mas" onClick={handleShowMore}>ver más...</div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                <div className="columna centro">
                    <div className="medicine-detail">
                        <img src={medicinaImg} alt="Vendedor" className="medicine-image" />
                        {selectedVendedor ? (
                            <div className="medicine-info">
                                <h3>{selectedVendedor.nombre}</h3>
                                <p><strong>DPI:</strong> {selectedVendedor.dpi}</p>
                                <p><strong>Teléfono:</strong> {selectedVendedor.numeroCelular}</p>
                                <textarea
                                    value={descripcion}
                                    onChange={(e) => setDescripcion(e.target.value)}
                                    placeholder="Descripción del vendedor..."
                                    rows={5}
                                />
                                <div className="medicine-actions">
                                    <button 
                                        className="save-report"
                                        onClick={handleSaveDescripcion}
                                    >
                                        Guardar Descripción
                                    </button>
                                    <button 
                                        className="mark-delete"
                                        onClick={() => handleMarkForDeletion(selectedVendedor)}
                                    >
                                        Marcar para baja
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="no-selection">
                                <p>Seleccione un vendedor para ver sus detalles</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="columna derecha">
                    <div className="delete-section">
                        <h3>VENDEDORES PARA DAR DE BAJA ({vendedoresToDelete.length})</h3>
                        {vendedoresToDelete.length === 0 ? (
                            <p>No hay vendedores marcados para eliminar</p>
                        ) : (
                            <>
                                {vendedoresToDelete.map((vendedor) => (
                                    <div key={`delete-${vendedor.dpi}`} className="item-delete">
                                        {vendedor.nombre} - DPI: {vendedor.dpi}
                                    </div>
                                ))}
                                <div className="delete-actions">
                                    <button 
                                        className="cancel-button"
                                        onClick={() => setVendedoresToDelete([])}
                                    >
                                        Cancelar
                                    </button>
                                    <button 
                                        className="delete-button"
                                        onClick={handleDeleteMarked}
                                    >
                                        Eliminar ({vendedoresToDelete.length})
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="columna productos-container">
                    <div className="panel1">
                        <h2 className="panel-title1">AGREGAR NUEVOS VENDEDORES</h2>
                        <form className="formulario1" onSubmit={handleAddVendedor}>
                            <label>Nombre del vendedor:</label>
                            <input 
                                type="text" 
                                name="nombre" 
                                value={newVendedor.nombre}
                                onChange={handleInputChange}
                                required
                            />
                            <label>No. Celular:</label>
                            <input 
                                type="number" 
                                name="numeroCelular" 
                                value={newVendedor.numeroCelular === 0 ? '' : newVendedor.numeroCelular}
                                onChange={handleInputChange}
                            />
                            <label>DPI:</label>
                            <input 
                                type="text" 
                                name="dpi" 
                                value={newVendedor.dpi}
                                onChange={handleInputChange}
                                required
                            />
                            <div className="imagen-vendedor1">
                                <div className="image-placeholder1"></div>
                                <p>Imagen del vendedor nuevo</p>
                            </div>
                            <div className="form-buttons1">
                                <button 
                                    type="button" 
                                    className="cancelar1" 
                                    onClick={handleCancelAddVendedor}
                                >
                                    Cancelar
                                </button>
                                <button 
                                    type="submit" 
                                    className="agregar1"
                                    disabled={addingVendedor}
                                >
                                    {addingVendedor ? 'Agregando...' : 'Agregar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Vendedores;