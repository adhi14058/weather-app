import { Module } from '@nestjs/common';
import { WeatherController } from './weather.controller';
import { LocationModule } from '../location/location.module';
import { WeatherService } from './weather.service';

@Module({
  imports: [LocationModule],
  controllers: [WeatherController],
  providers: [WeatherService],
  exports: [WeatherService],
})
export class WeatherModule {}
