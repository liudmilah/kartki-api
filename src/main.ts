import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  const configService = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe({
    disableErrorMessages: configService.get<boolean>('isProd'),
  }));

  await app.listen(3000);
}
bootstrap();
