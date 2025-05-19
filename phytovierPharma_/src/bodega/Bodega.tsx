import React, { useState, useEffect } from "react";
import "./Bodega.css";
import { useNavigate } from "react-router-dom";
import medicinaImg from '../assets/medicina.jpeg';

interface Medicine {
    _id: string;
    name: string;
    type?: string;
    price: number;
    provider?: string;
    descripcion?: string;
}

const Bodega: React.FC = () => {
    const navigate = useNavigate();
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [medicinesToDelete, setMedicinesToDelete] = useState<Medicine[]>([]);
    const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
    const [report, setReport] = useState("");
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchMedicines = async () => {
            try {
                setLoading(true);
                const url = searchTerm 
                    ? `http://localhost:3000/medicine/search?name=${searchTerm}`
                    : 'http://localhost:3000/medicine';

                const response = await fetch(url);
                const data = await response.json();
                setMedicines(data);
            } catch (error) {
                console.error("Error al cargar medicamentos:", error);
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

            setMedicines(medicines.filter(m => !medicinesToDelete.some(md => md._id === m._id)));
            setMedicinesToDelete([]);
            if (selectedMedicine && medicinesToDelete.some(m => m._id === selectedMedicine._id)) {
                setSelectedMedicine(null);
            }
        } catch (error) {
            console.error("Error al eliminar medicamentos:", error);
        }
    };

    const handleSaveReport = async () => {
        if (!selectedMedicine) return;

        try {
            await fetch(`http://localhost:3000/medicine/${selectedMedicine._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ descripcion: report }),
            });
        } catch (error) {
            console.error("Error al guardar reporte:", error);
        }
    };

    return ( 
        <div className="bodega-container">
            <div className="header">
                <div className="logo">Phytovier Pharma</div>
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
                <button onClick={() => navigate('/productos')}>Productos</button>
                <button onClick={() => navigate('/reportes-gastos')}>Reportes de Gastos</button>
                <button onClick={() => navigate('/configuracion')}>Configuración</button>
            </div>

            <div className="bodega-content">
                <div className="columna izquierda">
                    <div className="lista-medicamentos">
                        {loading ? (
                            <div className="loading">Cargando medicamentos...</div>
                        ) : (
                            <>
                                {medicines.slice(0, 14).map((medicine) => (
                                    <div 
                                        key={medicine._id} 
                                        className={`item ${selectedMedicine?._id === medicine._id ? 'seleccionado' : ''}`}
                                        onClick={() => handleSelectMedicine(medicine)}
                                    >
                                        <div className="medicine-name">{medicine.name}</div>
                                        <div className="medicine-price">${medicine.price}</div>
                                    </div>
                                ))}
                                {medicines.length > 14 && (
                                    <div className="item ver-mas">ver más...</div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                <div className="columna centro">
                    <div className="medicine-detail">
                        <img src={medicinaImg} alt="Medicamento" className="medicine-image" />
                        {selectedMedicine && (
                            <div className="medicine-info">
                                <h3>{selectedMedicine.name}</h3>
                                <p><strong>Tipo:</strong> {selectedMedicine.type || 'No especificado'}</p>
                                <p><strong>Precio:</strong> ${selectedMedicine.price}</p>
                                <p><strong>Proveedor:</strong> {selectedMedicine.provider || 'No especificado'}</p>
                                <button 
                                    className="mark-delete"
                                    onClick={() => handleMarkForDeletion(selectedMedicine)}
                                >
                                    Marcar para baja
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="columna derecha">
                    <div className="delete-section">
                        <h3>Medicamentos para dar de baja</h3>
                        {medicinesToDelete.map((medicine) => (
                            <div key={`delete-${medicine._id}`} className="item-delete">
                                {medicine.name}
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
                                disabled={medicinesToDelete.length === 0}
                            >
                                Eliminar ({medicinesToDelete.length})
                            </button>
                        </div>
                    </div>
                </div>

                {/* Moved the productos-container to be a column in the main layout */}
                <div className="columna productos-container">
                    <div className="panel1">
                        <h2 className="panel-title1">AGREGAR NUEVOS PRODUCTOS</h2>
                        <form className="formulario1">
                            <label>Nombre de Producto:</label>
                            <input type="text" name="nombre" />
                            <label>Fecha de Vencimiento:</label>
                            <input type="date" name="fechaVencimiento" />
                            <label>Marca:</label>
                            <input type="text" name="marca" />
                            <label>Laboratorio:</label>
                            <input type="text" name="laboratorio" />
                            <label>Código de barras:</label>
                            <input type="text" name="codigoBarras" />
                            <div className="imagen-vendedor1">
                                <div className="image-placeholder1"></div>
                                <p>Imagen del producto nuevo</p>
                            </div>
                            <div className="form-buttons1">
                                <button type="button" className="cancelar1">Cancelar</button>
                                <button type="submit" className="agregar1">Agregar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Bodega;