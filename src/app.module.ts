import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CursosModule } from './cursos/cursos.module';
import { RetosModule } from './retos/retos.module';
import { NivelesModule } from './niveles/niveles.module';
import { ProgresoModule } from './progreso/progreso.module';
import { GamificacionModule } from './gamificacion/gamificacion.module';
import { SesionesUsoModule } from './sesiones-uso/sesiones-uso.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // Configuración de variables de entorno
    // isGlobal: true hace que ConfigModule esté disponible en toda la app
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Configuración de TypeORM con MySQL
    // useFactory permite inyectar ConfigService para leer variables de entorno
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const host = configService.get<string>('DB_HOST');
        const isRemote = host && host !== 'localhost' && host !== '127.0.0.1';
        return {
          type: 'mysql',
          host: host,
          port: +configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true, // ⚠️ Solo en desarrollo
          ssl: isRemote ? { rejectUnauthorized: false } : false,
        };
      },
      inject: [ConfigService],
    }),

    UserModule,

    AuthModule,
    CloudinaryModule,
    CursosModule,
    RetosModule,
    NivelesModule,
    ProgresoModule,
    GamificacionModule,
    SesionesUsoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
