import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';

async function bootstrap() {
  console.log('🔄 Sincronizando esquema de base de datos con TypeORM en Aiven...');
  const app = await NestFactory.createApplicationContext(AppModule);
  console.log('✅ Esquema y tablas creadas exitosamente.');
  await app.close();
}

bootstrap()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Error sincronizando:', err);
    process.exit(1);
  });

