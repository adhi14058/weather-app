import { Inject, Injectable } from '@nestjs/common';
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
import {
  CurrentWeatherResponse,
  ForecastResponse,
} from './types/weatherapi.types';
@Injectable()
export class WeatherService {
  private readonly logger = new CustomLogger(WeatherService.name);
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly weatherApi: WeatherApiProvider,
    private readonly locationService: LocationService,
  ) {}

  async getCurrentWeatherByLocation(
    city: string,
  ): Promise<CurrentWeatherResponse['current']> {
    //prettier-ignore
    const result = await this.cacheManager
      .get(`${WEATHER_CACHE_KEY}:${city}`)
      .catch((error) => { this.logger.error(`${error}`) });
    if (result) return result as CurrentWeatherResponse['current'];

    const cityWeather = await this.weatherApi.fetchCurrentWeather(city);

    //prettier-ignore
    await this.cacheManager
      .set(`${WEATHER_CACHE_KEY}:${city}`, cityWeather.current)
      .catch((error) => { this.logger.error(`${error}`) });

    await this.locationService.updateLocationAccessedOn(city).catch((error) => {
      this.logger.error(`${error}`);
    });
    return cityWeather.current;
  }

  async getFiveDayForecastByLocation(
    city: string,
  ): Promise<ForecastResponse['forecast']> {
    //prettier-ignore
    const result = await this.cacheManager
      .get(`${FORECAST_CACHE_KEY}:${city}`)
      .catch((error) => { this.logger.error(`${error}`) });
    if (result) return result as ForecastResponse['forecast'];

    const cityForecastWeather = await this.weatherApi.fetchFiveDayForecast(city); //prettier-ignore

    //prettier-ignore
    await this.cacheManager
      .set(`${FORECAST_CACHE_KEY}:${city}`, cityForecastWeather.forecast, _4_HOURS_IN_MS)
      .catch((error) => { this.logger.error(`${error}`) });

    await this.locationService.updateLocationAccessedOn(city).catch((error) => {
      this.logger.error(`${error}`);
    });
    return cityForecastWeather.forecast;
  }
}
