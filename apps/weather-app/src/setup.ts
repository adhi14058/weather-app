import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

import { Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggingInterceptor } from './core/interceptors/logging.interceptor';
import { CustomExceptionFilter } from './core/exceptionFilters/CustomException.filter';

export function setupGlobals(app: NestExpressApplication) {
  const config = new DocumentBuilder()
    .setTitle('API DOCS')
    .setDescription('REST API Documentation')
    .setVersion('1.0')
    .addBearerAuth({
      description: `Please enter token in following format: <JWT>`,
      name: 'Authorization',
      bearerFormat: 'Bearer',
      scheme: 'Bearer',
      type: 'http',
      in: 'Header',
    })
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

  app.useGlobalFilters(new CustomExceptionFilter());

  app.useGlobalPipes(new ValidationPipe());

  return app;
}
