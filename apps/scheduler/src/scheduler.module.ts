import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { SchedulerService } from './scheduler.service';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    // Load .env and make ConfigService available globally
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    // Configure BullModule to use your Redis server
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('REDIS_HOST'),
          port: parseInt(configService.get<string>('REDIS_PORT')!, 10),
        },
      }),
      inject: [ConfigService],
    }),
    // Register the same queue (or queues) that your main app’s consumer listens to.
    BullModule.registerQueue({ name: 'Scheduler-Queue' }),
  ],
  controllers: [],
  providers: [SchedulerService],
})
export class SchedulerModule {}
