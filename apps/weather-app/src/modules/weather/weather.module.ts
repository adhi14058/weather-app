import { Module } from '@nestjs/common';
import { WeatherController } from './weather.controller';

@Module({
  controllers: [WeatherController],
  providers: [],
  exports: [],
})
export class WeatherModule {}
