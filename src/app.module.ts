import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import { AuthModule } from 'src/auth/auth.module';
import { ClienteModule } from 'src/cliente/cliente.module';
import { CategoriaModule } from 'src/categoria/categoria.module';
import { VehiculoModule } from 'src/vehiculo/vehiculo.module';
import { ReservaModule } from 'src/reserva/reserva.module';
import { PagoModule } from 'src/pago/pago.module';
import { VehiculoImagenModule } from 'src/vehiculo-imagen/vehiculo-imagen.module';
import { EmpleadoModule } from 'src/empleado/empleado.module';
import { AdminModule } from 'src/admin/admin.module';
import { ModeloModule } from 'src/modelo/modelo.module';
import { TemporadaPrecioModule } from 'src/temporada-precio/temporada-precio.module';
import { ModeloPrecioTemporadaModule } from 'src/modelo-precio-temporada/modelo-precio-temporada.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isProd = configService.get<string>('STAGE') === 'prod';

        return {
          type: 'postgres' as const,
          host: configService.get<string>('DB_HOST', 'localhost'),
          port: Number(configService.get<string>('DB_PORT', '5432')),
          database: configService.get<string>('DB_NAME', 'rentcar'),
          username: configService.get<string>('DB_USERNAME', 'postgres'),
          password: configService.get<string>('DB_PASSWORD', 'postgres'),
          ssl: isProd,
          extra: isProd ? { ssl: { rejectUnauthorized: false } } : undefined,
          autoLoadEntities: true,
          synchronize: configService.get<string>('TYPEORM_SYNC') === 'true',
        };
      },
    }),
    AuthModule,
    ClienteModule,
    CategoriaModule,
    VehiculoModule,
    VehiculoImagenModule,
    ModeloModule,
    TemporadaPrecioModule,
    ModeloPrecioTemporadaModule,
    EmpleadoModule,
    AdminModule,
    ReservaModule,
    PagoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
