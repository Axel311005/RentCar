import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Vehiculo } from 'src/vehiculo/entities/vehiculo.entity';
import { ModeloImagen } from 'src/vehiculo/entities/vehiculo-imagen.entity';
import { VehiculoEstado } from 'src/vehiculo/enums/vehiculo-estado.enum';
import { EncryptionService } from 'src/auth/services/encryption.service';
import { Cliente } from 'src/cliente/entities/cliente.entity';
import { Empleado } from 'src/empleado/entities/empleado.entity';
import { Modelo } from 'src/modelo/entities/modelo.entity';
import { TemporadaPrecio } from 'src/temporada-precio/entities/temporada-precio.entity';
import { ModeloPrecioTemporada } from 'src/modelo-precio-temporada/entities/modelo-precio-temporada.entity';
import { Categoria } from 'src/categoria/entities/categoria.entity';
import { EstadoGeneral } from 'src/enum/estado-general.enum';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
    @InjectRepository(Empleado)
    private readonly empleadoRepository: Repository<Empleado>,
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
    @InjectRepository(Modelo)
    private readonly modeloRepository: Repository<Modelo>,
    @InjectRepository(TemporadaPrecio)
    private readonly temporadaPrecioRepository: Repository<TemporadaPrecio>,
    @InjectRepository(ModeloPrecioTemporada)
    private readonly modeloPrecioTemporadaRepository: Repository<ModeloPrecioTemporada>,
    @InjectRepository(Vehiculo)
    private readonly vehiculoRepository: Repository<Vehiculo>,
    @InjectRepository(ModeloImagen)
    private readonly modeloImagenRepository: Repository<ModeloImagen>,
    private readonly encryptionService: EncryptionService,
  ) {}

  async run() {
    const usersToSeed: Array<Partial<User>> = [
      {
        email: 'admin@rentcar.com',
        password: this.encryptionService.encrypt('Admin1234!'),
        roles: ['admin'],
        isActive: true,
        loginAttempts: 0,
        blockedUntil: null,
      },
      {
        email: 'cliente.demo@rentcar.com',
        password: this.encryptionService.encrypt('Cliente1234!'),
        roles: ['cliente'],
        isActive: true,
        loginAttempts: 0,
        blockedUntil: null,
      },
      {
        email: 'empleado.demo@rentcar.com',
        password: this.encryptionService.encrypt('Empleado1234!'),
        roles: ['admin'],
        isActive: true,
        loginAttempts: 0,
        blockedUntil: null,
      },
    ];

    await this.userRepository.upsert(usersToSeed, ['email']);

    const [clienteUser, empleadoUser] = await Promise.all([
      this.userRepository.findOne({
        where: { email: 'cliente.demo@rentcar.com' },
      }),
      this.userRepository.findOne({
        where: { email: 'empleado.demo@rentcar.com' },
      }),
    ]);

    if (!clienteUser || !empleadoUser) {
      throw new Error('No se pudieron recuperar los usuarios base del seed.');
    }

    const clienteExistente = await this.clienteRepository.findOne({
      where: { email: 'cliente.demo@rentcar.com' },
      relations: { user: true },
    });

    if (clienteExistente) {
      clienteExistente.nombres = 'Cliente';
      clienteExistente.apellidos = 'Demo';
      clienteExistente.telefono = '+595981111111';
      clienteExistente.estado = EstadoGeneral.ACTIVO;
      clienteExistente.user = clienteUser;
      await this.clienteRepository.save(clienteExistente);
    } else {
      const cliente = this.clienteRepository.create({
        nombres: 'Cliente',
        apellidos: 'Demo',
        email: 'cliente.demo@rentcar.com',
        telefono: '+595981111111',
        estado: EstadoGeneral.ACTIVO,
        user: clienteUser,
      });
      await this.clienteRepository.save(cliente);
    }

    const empleadoExistente = await this.empleadoRepository.findOne({
      where: { email: 'empleado.demo@rentcar.com' },
      relations: { user: true },
    });

    if (empleadoExistente) {
      empleadoExistente.nombres = 'Empleado';
      empleadoExistente.apellidos = 'Demo';
      empleadoExistente.telefono = '+595982222222';
      empleadoExistente.cargo = 'Supervisor';
      empleadoExistente.estado = EstadoGeneral.ACTIVO;
      empleadoExistente.user = empleadoUser;
      await this.empleadoRepository.save(empleadoExistente);
    } else {
      const empleado = this.empleadoRepository.create({
        nombres: 'Empleado',
        apellidos: 'Demo',
        email: 'empleado.demo@rentcar.com',
        telefono: '+595982222222',
        cargo: 'Supervisor',
        estado: EstadoGeneral.ACTIVO,
        user: empleadoUser,
      });
      await this.empleadoRepository.save(empleado);
    }

    const categoriasToSeed = [
      {
        nombre: 'Económico',
        descripcion: 'Vehículos compactos con bajo consumo para uso diario.',
        estado: EstadoGeneral.ACTIVO,
      },
      {
        nombre: 'SUV',
        descripcion: 'Vehículos utilitarios deportivos para viajes y familia.',
        estado: EstadoGeneral.ACTIVO,
      },
      {
        nombre: 'Premium',
        descripcion: 'Vehículos de alta gama con mayor confort.',
        estado: EstadoGeneral.ACTIVO,
      },
    ];

    for (const categoriaData of categoriasToSeed) {
      const existente = await this.categoriaRepository.findOne({
        where: { nombre: categoriaData.nombre },
      });

      if (existente) {
        existente.descripcion = categoriaData.descripcion;
        existente.estado = categoriaData.estado;
        await this.categoriaRepository.save(existente);
        continue;
      }

      const categoria = this.categoriaRepository.create(categoriaData);
      await this.categoriaRepository.save(categoria);
    }

    const categorias = await this.categoriaRepository.find();
    const categoriaByNombre = new Map(
      categorias.map((categoria) => [categoria.nombre, categoria]),
    );

    const modelosToSeed = [
      {
        marca: 'Toyota',
        nombre: 'Yaris',
        anio: 2022,
        tipoCombustible: 'gasolina',
        capacidadPasajeros: 5,
        precioBaseDiario: 45,
        estado: EstadoGeneral.ACTIVO,
        categoriaNombre: 'Económico',
      },
      {
        marca: 'Hyundai',
        nombre: 'Creta',
        anio: 2023,
        tipoCombustible: 'gasolina',
        capacidadPasajeros: 5,
        precioBaseDiario: 75,
        estado: EstadoGeneral.ACTIVO,
        categoriaNombre: 'SUV',
      },
      {
        marca: 'BMW',
        nombre: 'Serie 3',
        anio: 2021,
        tipoCombustible: 'gasolina',
        capacidadPasajeros: 5,
        precioBaseDiario: 120,
        estado: EstadoGeneral.ACTIVO,
        categoriaNombre: 'Premium',
      },
    ];

    for (const modeloData of modelosToSeed) {
      const categoria = categoriaByNombre.get(modeloData.categoriaNombre);
      if (!categoria) {
        throw new Error(
          `No se encontró la categoría ${modeloData.categoriaNombre} para sembrar modelos.`,
        );
      }

      const existente = await this.modeloRepository.findOne({
        where: {
          marca: modeloData.marca,
          nombre: modeloData.nombre,
          anio: modeloData.anio,
        },
        relations: { categoria: true },
      });

      if (existente) {
        existente.marca = modeloData.marca;
        existente.nombre = modeloData.nombre;
        existente.anio = modeloData.anio;
        existente.tipoCombustible = modeloData.tipoCombustible;
        existente.capacidadPasajeros = modeloData.capacidadPasajeros;
        existente.precioBaseDiario = modeloData.precioBaseDiario;
        existente.estado = modeloData.estado;
        existente.categoria = categoria;
        await this.modeloRepository.save(existente);
        continue;
      }

      const modelo = this.modeloRepository.create({
        marca: modeloData.marca,
        nombre: modeloData.nombre,
        anio: modeloData.anio,
        tipoCombustible: modeloData.tipoCombustible,
        capacidadPasajeros: modeloData.capacidadPasajeros,
        precioBaseDiario: modeloData.precioBaseDiario,
        estado: modeloData.estado,
        categoria,
      });
      await this.modeloRepository.save(modelo);
    }

    const modelos = await this.modeloRepository.find();
    const modeloByKey = new Map(
      modelos.map((modelo) => [
        `${modelo.marca}|${modelo.nombre}|${modelo.anio}`,
        modelo,
      ]),
    );

    const vehiculosToSeed = [
      {
        placa: 'RNT-1001',
        color: 'Gris',
        estado: VehiculoEstado.DISPONIBLE,
        kilometraje: 22350,
        modeloKey: 'Toyota|Yaris|2022',
      },
      {
        placa: 'RNT-2001',
        color: 'Blanco',
        estado: VehiculoEstado.DISPONIBLE,
        kilometraje: 17400,
        modeloKey: 'Hyundai|Creta|2023',
      },
      {
        placa: 'RNT-3001',
        color: 'Negro',
        estado: VehiculoEstado.EN_REPARACION,
        kilometraje: 48100,
        modeloKey: 'BMW|Serie 3|2021',
      },
    ];

    for (const vehiculoData of vehiculosToSeed) {
      const modelo = modeloByKey.get(vehiculoData.modeloKey);
      if (!modelo) {
        throw new Error(
          `No se encontró el modelo ${vehiculoData.modeloKey} para sembrar vehículos.`,
        );
      }

      const existente = await this.vehiculoRepository.findOne({
        where: { placa: vehiculoData.placa },
        relations: { modelo: true },
      });

      if (existente) {
        existente.color = vehiculoData.color;
        existente.estado = vehiculoData.estado;
        existente.kilometraje = vehiculoData.kilometraje;
        existente.modelo = modelo;
        await this.vehiculoRepository.save(existente);
        continue;
      }

      const vehiculo = this.vehiculoRepository.create({
        placa: vehiculoData.placa,
        color: vehiculoData.color,
        estado: vehiculoData.estado,
        kilometraje: vehiculoData.kilometraje,
        modelo,
      });

      await this.vehiculoRepository.save(vehiculo);
    }

    const imagenesToSeed = [
      {
        modeloKey: 'Toyota|Yaris|2022',
        url: 'https://images.unsplash.com/photo-1549924231-f129b911e442',
      },
      {
        modeloKey: 'Hyundai|Creta|2023',
        url: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b',
      },
      {
        modeloKey: 'BMW|Serie 3|2021',
        url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e',
      },
    ];

    for (const imagenData of imagenesToSeed) {
      const modelo = modeloByKey.get(imagenData.modeloKey);
      if (!modelo) {
        throw new Error(
          `No se encontró el modelo ${imagenData.modeloKey} para la imagen seed.`,
        );
      }

      const existente = await this.modeloImagenRepository.findOne({
        where: { url: imagenData.url, modelo: { id: modelo.id } },
        relations: { modelo: true },
      });

      if (!existente) {
        const imagen = this.modeloImagenRepository.create({
          url: imagenData.url,
          modelo,
        });

        await this.modeloImagenRepository.save(imagen);
      }
    }

    const temporadasToSeed = [
      {
        descripcion: 'Temporada alta verano',
        fechaInicio: '2026-12-01',
        fechaFin: '2027-02-28',
      },
      {
        descripcion: 'Semana Santa',
        fechaInicio: '2027-03-24',
        fechaFin: '2027-04-02',
      },
      {
        descripcion: 'Vacaciones de invierno',
        fechaInicio: '2027-07-01',
        fechaFin: '2027-07-31',
      },
    ];

    for (const temporadaData of temporadasToSeed) {
      const existente = await this.temporadaPrecioRepository.findOne({
        where: {
          descripcion: temporadaData.descripcion,
          fechaInicio: temporadaData.fechaInicio,
          fechaFin: temporadaData.fechaFin,
        },
      });

      if (existente) {
        Object.assign(existente, temporadaData);
        await this.temporadaPrecioRepository.save(existente);
        continue;
      }

      const temporada = this.temporadaPrecioRepository.create(temporadaData);
      await this.temporadaPrecioRepository.save(temporada);
    }

    const temporadas = await this.temporadaPrecioRepository.find();
    const temporadaByDescripcion = new Map(
      temporadas.map((temporada) => [temporada.descripcion, temporada]),
    );

    const preciosTemporadaToSeed = [
      {
        modeloKey: 'Toyota|Yaris|2022',
        temporadaDescripcion: 'Temporada alta verano',
        precioDiario: 55,
      },
      {
        modeloKey: 'Hyundai|Creta|2023',
        temporadaDescripcion: 'Temporada alta verano',
        precioDiario: 89,
      },
      {
        modeloKey: 'BMW|Serie 3|2021',
        temporadaDescripcion: 'Temporada alta verano',
        precioDiario: 140,
      },
      {
        modeloKey: 'Toyota|Yaris|2022',
        temporadaDescripcion: 'Semana Santa',
        precioDiario: 52,
      },
      {
        modeloKey: 'Hyundai|Creta|2023',
        temporadaDescripcion: 'Vacaciones de invierno',
        precioDiario: 84,
      },
    ];

    for (const precioData of preciosTemporadaToSeed) {
      const modelo = modeloByKey.get(precioData.modeloKey);
      if (!modelo) {
        throw new Error(
          `No se encontró el modelo ${precioData.modeloKey} para el precio de temporada.`,
        );
      }

      const temporada = temporadaByDescripcion.get(
        precioData.temporadaDescripcion,
      );
      if (!temporada) {
        throw new Error(
          `No se encontró la temporada ${precioData.temporadaDescripcion} para sembrar precios por temporada.`,
        );
      }

      const existente = await this.modeloPrecioTemporadaRepository.findOne({
        where: {
          modelo: { id: modelo.id },
          temporada: { id: temporada.id },
        },
        relations: { modelo: true, temporada: true },
      });

      if (existente) {
        existente.precioDiario = precioData.precioDiario;
        await this.modeloPrecioTemporadaRepository.save(existente);
        continue;
      }

      const precioTemporada = this.modeloPrecioTemporadaRepository.create({
        modelo,
        temporada,
        precioDiario: precioData.precioDiario,
      });

      await this.modeloPrecioTemporadaRepository.save(precioTemporada);
    }

    return {
      message: 'Seed ejecutado correctamente',
      credentials: {
        admin: { email: 'admin@rentcar.com', password: 'Admin1234!' },
        cliente: {
          email: 'cliente.demo@rentcar.com',
          password: 'Cliente1234!',
        },
        empleado: {
          email: 'empleado.demo@rentcar.com',
          password: 'Empleado1234!',
        },
      },
    };
  }
}
