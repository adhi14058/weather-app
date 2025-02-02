import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module';
import * as httpContext from 'express-http-context';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(httpContext.middleware);

  app.set('trust proxy', 'loopback'); // Trust requests from the loopback address
  app.use(helmet());

  //TODO: add proper cors
  app.enableCors({
    origin: '*',
    methods: '*',
    allowedHeaders: '*',
    credentials: true,
  });

  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('WEATHER_APP_PORT') ?? 3000;
  await app.listen(PORT);
  logger.log(`Server listening on port ${PORT}`);
}
void bootstrap();
