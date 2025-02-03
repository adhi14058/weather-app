import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import {
  CurrentWeatherResponse,
  ForecastResponse,
} from '../../types/weatherapi.types';
import { ConfigService } from '@nestjs/config';
import { CustomLogger } from '../utils/CustomLogger';

@Injectable()
export class WeatherApiProvider {
  private apiKey: string;
  private baseUrl = 'http://api.weatherapi.com/v1';
  private readonly logger = new CustomLogger(WeatherApiProvider.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('WEATHERAPI_KEY')!;
  }

  async fetchCurrentWeather(city: string): Promise<CurrentWeatherResponse> {
    const url = `${this.baseUrl}/current.json?key=${this.apiKey}&q=${encodeURIComponent(city)}`;
    try {
      const response$ = this.httpService.get<CurrentWeatherResponse>(url);
      const response = await lastValueFrom(response$);
      return response.data;
    } catch (error) {
      this.logger.error(`${error}`);
      throw new HttpException(
        'Failed to retrieve current weather',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async fetch5DayForecast(city: string): Promise<ForecastResponse> {
    const url = `${this.baseUrl}/forecast.json?key=${this.apiKey}&q=${encodeURIComponent(city)}&days=5`;
    try {
      const response$ = this.httpService.get<ForecastResponse>(url);
      const response = await lastValueFrom(response$);
      return response.data;
    } catch (error) {
      this.logger.error(`${error}`);
      throw new HttpException(
        'Failed to retrieve forecast',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
