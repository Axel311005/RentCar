import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Categoria } from 'src/categoria/entities/categoria.entity';
import { Vehiculo } from 'src/vehiculo/entities/vehiculo.entity';
import { VehiculoImagen } from 'src/vehiculo/entities/vehiculo-imagen.entity';
import { VehiculoEstado } from 'src/vehiculo/enums/vehiculo-estado.enum';
import { EncryptionService } from 'src/auth/services/encryption.service';
import { Cliente } from 'src/cliente/entities/cliente.entity';
import { Empleado } from 'src/empleado/entities/empleado.entity';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
    @InjectRepository(Empleado)
    private readonly empleadoRepository: Repository<Empleado>,
    @InjectRepository(Vehiculo)
    private readonly vehiculoRepository: Repository<Vehiculo>,
    @InjectRepository(VehiculoImagen)
    private readonly vehiculoImagenRepository: Repository<VehiculoImagen>,
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
      clienteExistente.user = clienteUser;
      await this.clienteRepository.save(clienteExistente);
    } else {
      const cliente = this.clienteRepository.create({
        nombres: 'Cliente',
        apellidos: 'Demo',
        email: 'cliente.demo@rentcar.com',
        telefono: '+595981111111',
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
      empleadoExistente.activo = true;
      empleadoExistente.user = empleadoUser;
      await this.empleadoRepository.save(empleadoExistente);
    } else {
      const empleado = this.empleadoRepository.create({
        nombres: 'Empleado',
        apellidos: 'Demo',
        email: 'empleado.demo@rentcar.com',
        telefono: '+595982222222',
        cargo: 'Supervisor',
        activo: true,
        user: empleadoUser,
      });
      await this.empleadoRepository.save(empleado);
    }

    const categoriasToSeed = [
      {
        nombre: 'Económico',
        descripcion: 'Vehículos compactos con bajo consumo para uso diario.',
      },
      {
        nombre: 'SUV',
        descripcion: 'Vehículos utilitarios deportivos para viajes y familia.',
      },
      {
        nombre: 'Premium',
        descripcion: 'Vehículos de alta gama con mayor confort.',
      },
    ];

    for (const categoriaData of categoriasToSeed) {
      const existente = await this.categoriaRepository.findOne({
        where: { nombre: categoriaData.nombre },
      });

      if (existente) {
        existente.descripcion = categoriaData.descripcion;
        await this.categoriaRepository.save(existente);
        continue;
      }

      const categoria = this.categoriaRepository.create(categoriaData);
      await this.categoriaRepository.save(categoria);
    }

    const categorias = await this.categoriaRepository.find();
    const categoriaByNombre = new Map(
      categorias.map((cat) => [cat.nombre, cat]),
    );

    const vehiculosToSeed = [
      {
        marca: 'Toyota',
        modelo: 'Yaris',
        anio: 2022,
        placa: 'RNT-1001',
        precioPorDia: 45,
        estado: VehiculoEstado.DISPONIBLE,
        activo: true,
        categoriaNombre: 'Económico',
      },
      {
        marca: 'Hyundai',
        modelo: 'Creta',
        anio: 2023,
        placa: 'RNT-2001',
        precioPorDia: 75,
        estado: VehiculoEstado.DISPONIBLE,
        activo: true,
        categoriaNombre: 'SUV',
      },
      {
        marca: 'BMW',
        modelo: 'Serie 3',
        anio: 2021,
        placa: 'RNT-3001',
        precioPorDia: 120,
        estado: VehiculoEstado.MANTENIMIENTO,
        activo: true,
        categoriaNombre: 'Premium',
      },
    ];

    for (const vehiculoData of vehiculosToSeed) {
      const categoria = categoriaByNombre.get(vehiculoData.categoriaNombre);
      if (!categoria) {
        throw new Error(
          `No se encontró la categoría ${vehiculoData.categoriaNombre} para sembrar vehículos.`,
        );
      }

      const existente = await this.vehiculoRepository.findOne({
        where: { placa: vehiculoData.placa },
        relations: { categoria: true },
      });

      if (existente) {
        existente.marca = vehiculoData.marca;
        existente.modelo = vehiculoData.modelo;
        existente.anio = vehiculoData.anio;
        existente.precioPorDia = vehiculoData.precioPorDia;
        existente.estado = vehiculoData.estado;
        existente.activo = vehiculoData.activo;
        existente.categoria = categoria;
        await this.vehiculoRepository.save(existente);
        continue;
      }

      const vehiculo = this.vehiculoRepository.create({
        marca: vehiculoData.marca,
        modelo: vehiculoData.modelo,
        anio: vehiculoData.anio,
        placa: vehiculoData.placa,
        precioPorDia: vehiculoData.precioPorDia,
        estado: vehiculoData.estado,
        activo: vehiculoData.activo,
        categoria,
      });

      await this.vehiculoRepository.save(vehiculo);
    }

    const vehiculos = await this.vehiculoRepository.find();
    const vehiculoByPlaca = new Map(
      vehiculos.map((vehiculo) => [vehiculo.placa, vehiculo]),
    );

    const imagenesToSeed = [
      {
        placa: 'RNT-1001',
        url: 'https://images.unsplash.com/photo-1549924231-f129b911e442',
        altText: 'Toyota Yaris gris estacionado',
        esPrincipal: true,
      },
      {
        placa: 'RNT-2001',
        url: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b',
        altText: 'Hyundai Creta blanca en carretera',
        esPrincipal: true,
      },
      {
        placa: 'RNT-3001',
        url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e',
        altText: 'BMW Serie 3 negro en ciudad',
        esPrincipal: true,
      },
    ];

    for (const imagenData of imagenesToSeed) {
      const vehiculo = vehiculoByPlaca.get(imagenData.placa);
      if (!vehiculo) {
        throw new Error(
          `No se encontró el vehículo con placa ${imagenData.placa} para la imagen seed.`,
        );
      }

      const existente = await this.vehiculoImagenRepository.findOne({
        where: { url: imagenData.url, vehiculo: { id: vehiculo.id } },
        relations: { vehiculo: true },
      });

      if (existente) {
        existente.altText = imagenData.altText;
        existente.esPrincipal = imagenData.esPrincipal;
        await this.vehiculoImagenRepository.save(existente);
        continue;
      }

      const imagen = this.vehiculoImagenRepository.create({
        url: imagenData.url,
        altText: imagenData.altText,
        esPrincipal: imagenData.esPrincipal,
        vehiculo,
      });

      await this.vehiculoImagenRepository.save(imagen);
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
