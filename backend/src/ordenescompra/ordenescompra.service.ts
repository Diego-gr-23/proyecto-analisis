import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateOrdenescompraDto } from './dto/create-ordenescompra.dto';
import { UpdateOrdenescompraDto } from './dto/update-ordenescompra.dto';
import { Ordenescompra, OrdenescompraDocument } from './schemas/ordenescompra.schema';

@Injectable()
export class OrdenescompraService {
  constructor(
    @InjectModel(Ordenescompra.name) 
    private ordenescompraModel: Model<OrdenescompraDocument>
  ) {}

  async create(createOrdenescompraDto: CreateOrdenescompraDto): Promise<Ordenescompra> {
    if (createOrdenescompraDto.vendedorId && typeof createOrdenescompraDto.vendedorId === 'string') {
      createOrdenescompraDto.vendedorId = new Types.ObjectId(createOrdenescompraDto.vendedorId);
    }
    const nuevaOrden = new this.ordenescompraModel(createOrdenescompraDto);
    return nuevaOrden.save();
  }

  async findAll(): Promise<Ordenescompra[]> {
    return this.ordenescompraModel
      .find()
      .populate('vendedorId', 'nombre email')
      .populate('medicinas.medicineId', 'nombre precio')
      .exec();
  }

  async findOne(id: string): Promise<Ordenescompra> {
    const orden = await this.ordenescompraModel
      .findById(id)
      .populate('vendedorId', 'nombre email')
      .populate('medicinas.medicineId', 'nombre precio')
      .exec();
    
    if (!orden) {
      throw new NotFoundException(`Orden de compra con ID ${id} no encontrada`);
    }
    return orden;
  }

  async findByVendedor(vendedorId: string): Promise<Ordenescompra[]> {
    return this.ordenescompraModel
      .find({ vendedorId })
      .populate('vendedorId', 'nombre email')
      .populate('medicinas.medicineId', 'nombre precio')
      .exec();
  }

  async getOrdenesPorVendedor(): Promise<any[]> {
    try {
      const count = await this.ordenescompraModel.countDocuments();
      if (count === 0) {
        await this.createSampleData();
      }

      // Obtener todos los vendedores primero
      const vendedores = await this.ordenescompraModel.db.collection('Vendedores').find().toArray();

      // Obtener las órdenes agrupadas por vendedor
      const ordenesPorVendedor = await this.ordenescompraModel.aggregate([
        {
          $lookup: {
            from: 'Vendedores',
            localField: 'vendedorId',
            foreignField: '_id',
            as: 'vendedor'
          }
        },
        {
          $unwind: '$vendedor'
        },
        {
          $group: {
            _id: '$vendedorId',
            vendedor: { $first: '$vendedor' },
            ordenes: {
              $push: {
                _id: '$_id',
                numeroOrden: '$numeroOrden',
                descripcion: '$descripcion',
                fechaCreacion: '$fechaCreacion',
                fechaEntrega: '$fechaEntrega',
                total: '$total',
                estado: '$estado',
                medicinas: '$medicinas',
                observaciones: '$observaciones',
                urgente: '$urgente'
              }
            },
            totalOrdenes: { $sum: 1 },
            montoTotal: { $sum: '$total' },
            ordenesUrgentes: { 
              $sum: { $cond: ['$urgente', 1, 0] } 
            }
          }
        }
      ]);

      // Combinar todos los vendedores con sus órdenes (si las tienen)
      const resultado = vendedores.map(vendedor => {
        const vendedorConOrdenes = ordenesPorVendedor.find(o => o._id.toString() === vendedor._id.toString());
        
        return vendedorConOrdenes || {
          _id: vendedor._id,
          vendedor: {
            _id: vendedor._id,
            nombre: vendedor.nombre,
            email: vendedor.email
          },
          ordenes: [],
          totalOrdenes: 0,
          montoTotal: 0,
          ordenesUrgentes: 0
        };
      });

      return resultado.sort((a, b) => a.vendedor.nombre.localeCompare(b.vendedor.nombre));
    } catch (error) {
      console.error('Error en getOrdenesPorVendedor:', error);
      throw error;
    }
  }

  async update(id: string, updateOrdenescompraDto: UpdateOrdenescompraDto): Promise<Ordenescompra> {
    const ordenActualizada = await this.ordenescompraModel
      .findByIdAndUpdate(id, updateOrdenescompraDto, { new: true })
      .populate('vendedorId', 'nombre email')
      .populate('medicinas.medicineId', 'nombre precio')
      .exec();
    
    if (!ordenActualizada) {
      throw new NotFoundException(`Orden de compra con ID ${id} no encontrada`);
    }
    return ordenActualizada;
  }

  async remove(id: string): Promise<void> {
    const resultado = await this.ordenescompraModel.findByIdAndDelete(id).exec();
    if (!resultado) {
      throw new NotFoundException(`Orden de compra con ID ${id} no encontrada`);
    }
  }

  async createSampleData(): Promise<void> {
    const count = await this.ordenescompraModel.countDocuments();
    if (count === 0) {
      const [vendedores, medicines] = await Promise.all([
        this.ordenescompraModel.db.collection('Vendedores').find().limit(2).toArray(),
        this.ordenescompraModel.db.collection('Medicine').find().limit(6).toArray()
      ]);

      if (vendedores.length < 2) {
        throw new Error('Se necesitan al menos 2 vendedores en la base de datos');
      }

      const medicinasValidas = medicines.filter(m => m.nombre || m.name);
      if (medicinasValidas.length < 6) {
        throw new Error(`Solo ${medicinasValidas.length}/6 medicinas tienen nombre válido. Verifica la colección Medicine.`);
      }

      const sampleData = [
        {
          numeroOrden: 'ORD-001',
          descripcion: 'Pedido de medicamentos básicos',
          vendedorId: vendedores[0]._id,
          fechaCreacion: new Date(),
          fechaEntrega: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          total: 350.75,
          estado: 'pendiente',
          medicinas: [
            {
              medicineId: medicines[0]._id,
              nombreMedicina: medicines[0].nombre || medicines[0].name || 'Medicina 1',
              cantidad: 100,
              precioUnitario: 1.25,
              subtotal: 125.00
            },
            {
              medicineId: medicines[1]._id,
              nombreMedicina: medicines[1].nombre || medicines[1].name || 'Medicina 2',
              cantidad: 50,
              precioUnitario: 2.50,
              subtotal: 125.00
            },
            {
              medicineId: medicines[2]._id,
              nombreMedicina: medicines[2].nombre || medicines[2].name || 'Medicina 3',
              cantidad: 30,
              precioUnitario: 3.35,
              subtotal: 100.50
            }
          ],
          urgente: true
        },
        {
          numeroOrden: 'ORD-002',
          descripcion: 'Pedido de medicamentos especializados',
          vendedorId: vendedores[1]._id,
          fechaCreacion: new Date(),
          fechaEntrega: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          total: 720.30,
          estado: 'procesando',
          medicinas: [
            {
              medicineId: medicines[3]._id,
              nombreMedicina: medicines[3].nombre || medicines[3].name || 'Medicina 4',
              cantidad: 60,
              precioUnitario: 4.20,
              subtotal: 252.00
            },
            {
              medicineId: medicines[4]._id,
              nombreMedicina: medicines[4].nombre || medicines[4].name || 'Medicina 5',
              cantidad: 45,
              precioUnitario: 5.80,
              subtotal: 261.00
            },
            {
              medicineId: medicines[5]._id,
              nombreMedicina: medicines[5].nombre || medicines[5].name || 'Medicina 6',
              cantidad: 35,
              precioUnitario: 5.92,
              subtotal: 207.20
            }
          ],
          observaciones: 'Entregar antes del viernes',
          urgente: false
        }
      ];

      await this.ordenescompraModel.insertMany(sampleData);
      console.log('Datos de muestra creados exitosamente');
    }
  }
}