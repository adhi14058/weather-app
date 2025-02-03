import { LocationService } from '../location/location.service';
import { WeatherApiProvider } from '../../core/providers/weatherApi';
import { Process, Processor } from '@nestjs/bull';
import { Inject, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { WEATHER_CACHE_KEY } from '../../core/constants/cache.constant';
import pLimit from 'p-limit';

@Processor('scheduler-queue')
export class weatherCacheProcessor {
  private readonly logger = new Logger(weatherCacheProcessor.name);
  private readonly limit = pLimit(20);
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private locationService: LocationService,
    private weatherApiProvider: WeatherApiProvider,
  ) {}

  @Process('refresh-weather-cache')
  async cacheUserFavoueriteLocations() {
    const locations =
      await this.locationService.getAllLocationsAccessedInLastNDay();
    const promises: Promise<void>[] = [];
    for (const location of locations) {
      promises.push(
        this.limit(async () => {
          try {
            const weatherKey = `${WEATHER_CACHE_KEY}:${location.city}`;
            if (!(await this.cacheManager.get(weatherKey))) {
              const weatherData = await this.weatherApiProvider.fetchCurrentWeather(location.city); //prettier-ignore
              await this.cacheManager.set(weatherKey, weatherData);
            }
          } catch (error) {
            this.logger.error(
              `Error Occoured while processing refresh-weather-cache weather cache ${error}`,
            );
          }

          try {
            const forecastKey = `${WEATHER_CACHE_KEY}:${location.city}`;
            if (!(await this.cacheManager.get(forecastKey))) {
              const forecastData = await this.weatherApiProvider.fetchFiveDayForecast(location.city); //prettier-ignore
              await this.cacheManager.set(forecastKey, forecastData);
            }
          } catch (error) {
            this.logger.error(
              `Error Occoured while processing refresh-weather-cache forecast cache ${error}`,
            );
          }
        }),
      );
    }
    await Promise.all(promises);
  }
}
