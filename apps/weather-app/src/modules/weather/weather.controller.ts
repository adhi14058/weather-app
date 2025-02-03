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

@Controller()
export class WeatherController {
  private readonly logger = new CustomLogger(WeatherController.name);
  private forecastTTL = _4_HOURS_IN_MS;

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly weatherApi: WeatherApiProvider,
  ) {}

  @Get('weather/:city')
  async getCurrentWeather(@Param('city') city: string) {
    //prettier-ignore
    const result = await this.cacheManager
      .get(`${WEATHER_CACHE_KEY}:${city}`)
      .catch((error) => { this.logger.error(`${error}`) });
    if (result) return result;

    const cityWeather = await this.weatherApi.fetchCurrentWeather(city);

    //prettier-ignore
    await this.cacheManager
      .set(`${WEATHER_CACHE_KEY}:${city}`, cityWeather)
      .catch((error) => { this.logger.error(`${error}`) });

    return cityWeather;
  }

  @Get('forecast/:city')
  async getFiveDayForecast(@Param('city') city: string) {
    //prettier-ignore
    const result = await this.cacheManager
      .get(`${FORECAST_CACHE_KEY}:${city}`)
      .catch((error) => { this.logger.error(`${error}`) });
    if (result) return result;

    const cityForecastWeather = await this.weatherApi.fetchFiveDayForecast(city); //prettier-ignore

    //prettier-ignore
    await this.cacheManager
      .set(`${FORECAST_CACHE_KEY}:${city}`, cityForecastWeather, this.forecastTTL)
      .catch((error) => { this.logger.error(`${error}`) });

    return cityForecastWeather;
  }
}
