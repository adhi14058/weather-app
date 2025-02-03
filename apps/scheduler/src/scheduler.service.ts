import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    @InjectQueue('scheduler-queue') private readonly myQueue: Queue,
  ) {}

  // This method will be executed at minute 1 and 31 of every hour
  @Cron('1,31 * * * *', { name: 'refreshWeatherCache' })
  async refreshWeatherCache(): Promise<void> {
    const job = await this.myQueue.add('refresh-weather-cache', {
      payload: { triggerTime: Date.now() },
    });
    this.logger.log(`Scheduled job with id: ${job.id} at ${job.timestamp}`);
  }
}
