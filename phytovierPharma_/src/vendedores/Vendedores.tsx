import React, {useState, useEffect} from "react";
import "./vendedores.css";
import { useNavigate } from "react-router-dom";
import medicinaImg from '../assets/medicina.jpeg';
import pharmaImg from "../assets/pharma.png";

interface Medicine {
    _id: string;
    name: string;
    type?: string;
    price: number;
    provider?: string;
    descripcion?: string;
}

interface NewProduct {
    name: string;
    expiryDate: string;
    price: number;
    type?: string;
    provider?: string;
}

const vendedores: React.FC = () => {
    const navigate = useNavigate();
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [medicinesToDelete, setMedicinesToDelete] = useState<Medicine[]>([]);
    const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
    const [report, setReport] = useState("");
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [displayCount, setDisplayCount] = useState(14); // Número inicial de medicamentos a mostrar
    
    // Estados para el formulario de nuevo producto
    const [newProduct, setNewProduct] = useState<NewProduct>({
        name: "",
        expiryDate: "",
        price: 0,
        type: "",
        provider: ""
    });
    const [addingProduct, setAddingProduct] = useState(false);

    useEffect(() => {
        const fetchMedicines = async () => {
            try {
                setLoading(true);
                const url = searchTerm 
                    ? `http://localhost:3000/medicine/search?name=${searchTerm}`
                    : 'http://localhost:3000/medicine';

                const response = await fetch(url);
                
                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }
                
                const result = await response.json();
                
                // Aquí está la corrección: Manejar correctamente la estructura de la respuesta
                const medicinesData = result.data || result;
                
                console.log("Datos recibidos:", medicinesData); // Log para debug
                
                setMedicines(Array.isArray(medicinesData) ? medicinesData : []);
                
            } catch (error) {
                console.error("Error al cargar medicamentos:", error);
                setMedicines([]); // Asegura que medicines sea un array vacío en caso de error
            } finally {
                setLoading(false);
            }
        };

        fetchMedicines();
    }, [searchTerm]);

    const handleLogout = () => {
        navigate('/');
    };

    const handleSelectMedicine = (medicine: Medicine) => {
        setSelectedMedicine(medicine);
        setReport(medicine.descripcion || "");
    };

    const handleMarkForDeletion = (medicine: Medicine) => {
        if (!medicinesToDelete.some(m => m._id === medicine._id)) {
            setMedicinesToDelete([...medicinesToDelete, medicine]);
        }
    };

    const handleDeleteMarked = async () => {
        try {
            await Promise.all(
                medicinesToDelete.map(medicine => 
                    fetch(`http://localhost:3000/medicine/${medicine._id}`, {
                        method: 'DELETE'
                    })
                )
            );

            // Actualizar la lista después de eliminar
            const updatedMedicines = medicines.filter(m => !medicinesToDelete.some(md => md._id === m._id));
            setMedicines(updatedMedicines);
            setMedicinesToDelete([]);
            
            if (selectedMedicine && medicinesToDelete.some(m => m._id === selectedMedicine._id)) {
                setSelectedMedicine(null);
            }
            
            alert('Medicamentos eliminados con éxito');
        } catch (error) {
            console.error("Error al eliminar medicamentos:", error);
            alert('Error al eliminar medicamentos');
        }
    };

    const handleSaveReport = async () => {
        if (!selectedMedicine) return;

        try {
            const response = await fetch(`http://localhost:3000/medicine/${selectedMedicine._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ descripcion: report }),
            });
            
            if (!response.ok) {
                throw new Error('Error al guardar el reporte');
            }
            
            // Actualizar el medicamento en la lista local
            const updatedMedicines = medicines.map(m => 
                m._id === selectedMedicine._id ? { ...m, descripcion: report } : m
            );
            
            setMedicines(updatedMedicines);
            alert('Reporte guardado con éxito');
        } catch (error) {
            console.error("Error al guardar reporte:", error);
            alert('Error al guardar el reporte');
        }
    };
    
    const handleShowMore = () => {
        // Incrementar el número de medicamentos mostrados
        // Si hay menos de 10 medicamentos restantes, mostrar todos. De lo contrario, mostrar 10 más.
        const remainingItems = medicines.length - displayCount;
        if (remainingItems <= 10) {
            setDisplayCount(medicines.length);
        } else {
            setDisplayCount(displayCount + 10);
        }
    };
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewProduct({
            ...newProduct,
            [name]: name === 'price' ? parseFloat(value) || 0 : value
        });
    };
    
    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!newProduct.name || !newProduct.price) {
            alert("Por favor ingrese al menos el nombre y precio del medicamento");
            return;
        }
        
        setAddingProduct(true);
        
        try {
            const response = await fetch('http://localhost:3000/medicine', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: newProduct.name,
                    price: newProduct.price,
                    type: newProduct.type || "Genérico",
                    provider: newProduct.provider || "No especificado",
                    descripcion: `Fecha de vencimiento: ${newProduct.expiryDate}`,
                }),
            });
            
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.message || 'Error al agregar el medicamento');
            }
            
            // Añadir el nuevo medicamento a la lista
            const newMedicine = result.data || result;
            setMedicines([...medicines, newMedicine]);
            
            setNewProduct({
                name: "",
                expiryDate: "",
                price: 0,
                type: "",
                provider: ""
            });
            
            alert("Medicamento agregado con éxito");
        } catch (error) {
            console.error("Error al agregar medicamento:", error);
            if (error instanceof Error) {
                alert(error.message || "Error al agregar medicamento. Por favor, inténtelo de nuevo.");
            } else {
                alert("Error al agregar medicamento. Por favor, inténtelo de nuevo.");
            }
        } finally {
            setAddingProduct(false);
        }
    };
    
    const handleCancelAddProduct = () => {
        setNewProduct({
            name: "",
            expiryDate: "",
            price: 0,
            type: "",
            provider: ""
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
                        placeholder="Buscar medicamento..." 
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
                    <h2>LISTA DE VENDEDORES ({medicines.length})</h2>
                    <div className="lista-medicamentos">
                        {loading ? (
                            <div className="loading">Cargando vendedores...</div>
                        ) : medicines.length === 0 ? (
                            <div className="no-medicines">No se encontraron vendedores</div>
                        ) : (
                            <>
                                {medicines.slice(0, displayCount).map((medicine) => (
                                    <div 
                                        key={medicine._id} 
                                        className={`item ${selectedMedicine?._id === medicine._id ? 'seleccionado' : ''}`}
                                        onClick={() => handleSelectMedicine(medicine)}
                                    >
                                        <div className="medicine-name">{medicine.name}</div>
                                        <div className="medicine-price">${medicine.price}</div>
                                    </div>
                                ))}
                                {medicines.length > displayCount && (
                                    <div className="item ver-mas" onClick={handleShowMore}>ver más...</div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                <div className="columna centro">
                    <div className="medicine-detail">
                        <img src={medicinaImg} alt="Medicamento" className="medicine-image" />
                        {selectedMedicine ? (
                            <div className="medicine-info">
                                <h3>{selectedMedicine.name}</h3>
                                <p><strong>Tipo:</strong> {selectedMedicine.type || 'No especificado'}</p>
                                <p><strong>Precio:</strong> ${selectedMedicine.price}</p>
                                <p><strong>Proveedor:</strong> {selectedMedicine.provider || 'No especificado'}</p>
                                <textarea
                                    value={report}
                                    onChange={(e) => setReport(e.target.value)}
                                    placeholder="Descripción del medicamento..."
                                    rows={5}
                                />
                                <div className="medicine-actions">
                                    <button 
                                        className="save-report"
                                        onClick={handleSaveReport}
                                    >
                                        Guardar Descripción
                                    </button>
                                    <button 
                                        className="mark-delete"
                                        onClick={() => handleMarkForDeletion(selectedMedicine)}
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
                        <h3>VENDEDORES PARA DAR DE BAJA ({medicinesToDelete.length})</h3>
                        {medicinesToDelete.length === 0 ? (
                            <p>No hay vendedores marcados para eliminar</p>
                        ) : (
                            <>
                                {medicinesToDelete.map((medicine) => (
                                    <div key={`delete-${medicine._id}`} className="item-delete">
                                        {medicine.name} - ${medicine.price}
                                    </div>
                                ))}
                                <div className="delete-actions">
                                    <button 
                                        className="cancel-button"
                                        onClick={() => setMedicinesToDelete([])}
                                    >
                                        Cancelar
                                    </button>
                                    <button 
                                        className="delete-button"
                                        onClick={handleDeleteMarked}
                                    >
                                        Eliminar ({medicinesToDelete.length})
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="columna productos-container">
                    <div className="panel1">
                        <h2 className="panel-title1">AGREGAR NUEVOS VENDEDORES</h2>
                        <form className="formulario1" onSubmit={handleAddProduct}>
                            <label>Nombre del vendedor:</label>
                            <input 
                                type="text" 
                                name="name" 
                                value={newProduct.name}
                                onChange={handleInputChange}
                                required
                            />
                            <label>Fecha de Nacimiento:</label>
                            <input 
                                type="date" 
                                name="expiryDate" 
                                value={newProduct.expiryDate}
                                onChange={handleInputChange}
                            />
                            <label>No. Celular:</label>
                            <input 
                                type="number" 
                                name="price" 
                                value={newProduct.price === 0 ? '' : newProduct.price}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setNewProduct({
                                        ...newProduct,
                                        price: value === '' ? 0 : parseFloat(value) || 0
                                    });
                                }}
                                onKeyDown={(e) => {
                                    // Permite solo números, punto decimal y teclas de control
                                    if (!/[0-9.]/.test(e.key) && 
                                        !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
                                        e.preventDefault();
                                    }
                                }}
                                step="any"
                                required
                            />
                            <label>DPI</label>
                            <input 
                                type="text" 
                                name="type" 
                                value={newProduct.type}
                                onChange={handleInputChange}
                                placeholder="Genérico, Especialidad, etc."
                            />
                            <label>Puesto:</label>
                            <input 
                                type="text" 
                                name="provider" 
                                value={newProduct.provider}
                                onChange={handleInputChange}
                            />
                            <div className="imagen-vendedor1">
                                <div className="image-placeholder1"></div>
                                <p>Imagen del vendedor nuevo</p>
                            </div>
                            <div className="form-buttons1">
                                <button 
                                    type="button" 
                                    className="cancelar1" 
                                    onClick={handleCancelAddProduct}
                                >
                                    Cancelar
                                </button>
                                <button 
                                    type="submit" 
                                    className="agregar1"
                                    disabled={addingProduct}
                                >
                                    {addingProduct ? 'Agregando...' : 'Agregar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default vendedores;