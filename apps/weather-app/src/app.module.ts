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
        limit: 1000,
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
    GlobalModule,
    UserModule,
    LocationModule,
    UserLocationModule,
    WeatherModule,
    QueueProcessorModule,
    AuthModule,
  ],
  controllers: [],
  providers: [WeatherApiProvider],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestContextMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
