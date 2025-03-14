import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestContextMiddleware } from './core/middlewares/requestContext.middleware';
import { WeatherApiProvider } from './core/providers/weatherApi';
import { GlobalModule } from './modules/global/global.module';
import { UserModule } from './modules/user/user.module';
import { LocationModule } from './modules/location/location.module';
import { UserLocationModule } from './modules/user-location/user-location.module';
import { WeatherModule } from './modules/weather/weather.module';
import {
  _1_MINUTES_IN_MS,
  _30_MINUTES_IN_MS,
} from './core/constants/time.constant';
import { QueueProcessorModule } from './modules/queue-processor/queue-processor.module';
import { AuthModule } from './modules/auth/auth.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { LocationResolver } from './modules/location/location.resolver';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get<string>('REDIS_HOST') || 'localhost',
        port: parseInt(configService.get<string>('REDIS_PORT')!, 10),
        ttl: _30_MINUTES_IN_MS,
      }),
      inject: [ConfigService],
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: _1_MINUTES_IN_MS,
        limit: 200,
      },
    ]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('POSTGRES_HOST'),
        port: parseInt(configService.get<string>('POSTGRES_PORT')!, 10),
        username: configService.get<string>('POSTGRES_USER'),
        password: configService.get<string>('POSTGRES_PASSWORD'),
        database: configService.get<string>('POSTGRES_DB'),
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'apps/weather-app/src/schema.gql'),
      playground: true,
      path: '/graphql',
      context: ({ req, res }) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        return { request: req, response: res };
      },
    }),
    GlobalModule,
    UserModule,
    LocationModule,
    UserLocationModule,
    WeatherModule,
    QueueProcessorModule,
    AuthModule,
  ],
  controllers: [],
  providers: [WeatherApiProvider, LocationResolver],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestContextMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
