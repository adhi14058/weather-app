import { Module } from '@nestjs/common';
import { WeatherController } from './weather.controller';
import { LocationModule } from '../location/location.module';

@Module({
  imports: [LocationModule],
  controllers: [WeatherController],
  providers: [],
  exports: [],
})
export class WeatherModule {}
