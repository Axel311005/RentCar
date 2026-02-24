import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import { UserModule } from 'src/user/user.module';
import { ClienteModule } from 'src/cliente/cliente.module';
import { CategoriaModule } from 'src/categoria/categoria.module';
import { VehiculoModule } from 'src/vehiculo/vehiculo.module';
import { ReservaModule } from 'src/reserva/reserva.module';
import { PagoModule } from 'src/pago/pago.module';

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
    UserModule,
    ClienteModule,
    CategoriaModule,
    VehiculoModule,
    ReservaModule,
    PagoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
