import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

import { Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggingInterceptor } from './core/interceptors/logging.interceptor';

export function setupGlobals(app: NestExpressApplication) {
  const config = new DocumentBuilder()
    .setTitle('API DOCS')
    .setDescription('REST API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document, {
    jsonDocumentUrl: 'swagger/json-spec',
    yamlDocumentUrl: 'swagger/yaml-spec',
    customSiteTitle: 'API DOCS',
  });

  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      strategy: 'excludeAll',
      excludeExtraneousValues: true,
    }),
  );

  app.useGlobalPipes(new ValidationPipe());

  return app;
}
