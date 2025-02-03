import { Controller, Get, Inject, Param } from '@nestjs/common';
import { WeatherApiProvider } from '../../core/providers/weatherApi';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CustomLogger } from '../../core/utils/CustomLogger';
import { _4_HOURS_IN_MS } from '../../core/constants/time.constant';
import {
  WEATHER_CACHE_KEY,
  FORECAST_CACHE_KEY,
} from '../../core/constants/cache.constant';
import { LocationService } from '../location/location.service';
import { plainToInstance } from 'class-transformer';
import { WeatherResponseDto } from './dto/response-weather.dto';
import { ForecastResponseDto } from './dto/response-forecast.dto';

@Controller()
export class WeatherController {
  private readonly logger = new CustomLogger(WeatherController.name);
  private forecastTTL = _4_HOURS_IN_MS;

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly weatherApi: WeatherApiProvider,
    private readonly locationService: LocationService,
  ) {}

  @Get('weather/:city')
  async getCurrentWeather(@Param('city') city: string) {
    //prettier-ignore
    const result = await this.cacheManager
      .get(`${WEATHER_CACHE_KEY}:${city}`)
      .catch((error) => { this.logger.error(`${error}`) });
    if (result) return plainToInstance(WeatherResponseDto, result);

    const cityWeather = await this.weatherApi.fetchCurrentWeather(city);

    //prettier-ignore
    await this.cacheManager
      .set(`${WEATHER_CACHE_KEY}:${city}`, cityWeather.current)
      .catch((error) => { this.logger.error(`${error}`) });

    await this.locationService.updateLocationAccessedOn(city).catch((error) => {
      this.logger.error(`${error}`);
    });
    return plainToInstance(WeatherResponseDto, cityWeather.current);
  }

  @Get('forecast/:city')
  async getFiveDayForecast(@Param('city') city: string) {
    //prettier-ignore
    const result = await this.cacheManager
      .get(`${FORECAST_CACHE_KEY}:${city}`)
      .catch((error) => { this.logger.error(`${error}`) });
    if (result) return plainToInstance(ForecastResponseDto, result);

    const cityForecastWeather = await this.weatherApi.fetchFiveDayForecast(city); //prettier-ignore

    //prettier-ignore
    await this.cacheManager
      .set(`${FORECAST_CACHE_KEY}:${city}`, cityForecastWeather.forecast, this.forecastTTL)
      .catch((error) => { this.logger.error(`${error}`) });

    await this.locationService.updateLocationAccessedOn(city).catch((error) => {
      this.logger.error(`${error}`);
    });
    return plainToInstance(ForecastResponseDto, cityForecastWeather.forecast);
  }
}
