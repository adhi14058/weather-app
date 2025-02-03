import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { WeatherApiProvider } from '../../core/providers/weatherApi';

@Global()
@Module({
  providers: [WeatherApiProvider],
  imports: [HttpModule],
  exports: [HttpModule, WeatherApiProvider],
})
export class GlobalModule {}
