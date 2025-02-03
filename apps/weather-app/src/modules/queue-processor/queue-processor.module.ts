import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LocationModule } from '../location/location.module';
import { weatherCacheProcessor } from './weatherCache.processor';

@Module({
  imports: [
    LocationModule,
    BullModule.registerQueueAsync({
      name: 'scheduler-queue',
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('REDIS_HOST'),
          port: parseInt(configService.get<string>('REDIS_PORT')!, 10),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [weatherCacheProcessor],
})
export class QueueProcessorModule {}
