import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module';
import * as httpContext from 'express-http-context';
import { LoggingInterceptor } from './core/interceptors/logging.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(httpContext.middleware);
  app.useGlobalInterceptors(new LoggingInterceptor());

  app.set('trust proxy', 'loopback'); // Trust requests from the loopback address
  app.use(helmet());

  //TODO: add proper cors
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('WEATHER_APP_PORT') ?? 3000;
  await app.listen(PORT);
  logger.log(`Server listening on port ${PORT}`);
}
void bootstrap();
