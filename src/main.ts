import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { REQUIRED_ENVS } from './common/requirements/envs';

export async function bootstrap() {
  for (const env of REQUIRED_ENVS) {
    if (!process.env[env]) {
      throw new Error(`Missing environment variable: ${env}`);
    }
  }

  const app = await NestFactory.create(AppModule);
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(process.env.SERVER_PORT);
}
bootstrap();
