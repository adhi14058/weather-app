import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WeatherApiProvider } from '../../core/providers/weatherApi';

@Global()
@Module({
  providers: [WeatherApiProvider],
  imports: [HttpModule, ConfigModule],
  exports: [HttpModule, ConfigModule, WeatherApiProvider],
})
export class GlobalModule {}
