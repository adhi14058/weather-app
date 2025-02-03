import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';

import { CustomLogger } from '../../core/utils/CustomLogger';

import { WeatherResponseDto } from './dto/response-weather.dto';
import { ForecastResponseDto } from './dto/response-forecast.dto';
import { WeatherService } from './weather.service';
import { plainToInstance } from 'class-transformer';

@Controller()
@UseInterceptors(ClassSerializerInterceptor)
export class WeatherController {
  private readonly logger = new CustomLogger(WeatherController.name);

  constructor(private readonly weatherService: WeatherService) {}

  @Get('weather/:city')
  @SerializeOptions({
    strategy: 'excludeAll',
    excludeExtraneousValues: true,
  })
  async getCurrentWeather(@Param('city') city: string) {
    this.logger.log(`Getting current weather for city ${city}`);
    const response = await this.weatherService.getCurrentWeatherByLocation(city); //prettier-ignore
    return plainToInstance(WeatherResponseDto, response);
  }

  @Get('forecast/:city')
  @SerializeOptions({
    strategy: 'excludeAll',
    excludeExtraneousValues: true,
    type: ForecastResponseDto,
  })
  async getFiveDayForecast(@Param('city') city: string) {
    this.logger.log(`Getting five day forecast for city ${city}`);
    const response = await this.weatherService.getFiveDayForecastByLocation(city); //prettier-ignore
    return plainToInstance(WeatherResponseDto, response);
  }
}
