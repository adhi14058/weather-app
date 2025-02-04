import {
  Injectable,
  Global,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import {
  CurrentWeatherResponse,
  ForecastResponse,
  LocationResponse,
} from '../../modules/weather/types/weatherapi.types';
import { ConfigService } from '@nestjs/config';
import { CustomLogger } from '../utils/CustomLogger';

@Global()
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

  private handleApiError(error: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
    const { code, message }: { code: string; message: string } = error?.response?.data?.error ?? {}; //prettier-ignore
    if (code || message) this.logger.error(`Error: ${code} -${message}`);
    switch (code) {
      case '1006':
        throw new BadRequestException('Invalid Location');
      default:
        throw new InternalServerErrorException('Something went wrong');
    }
  }

  async fetchCurrentWeather(city: string): Promise<CurrentWeatherResponse> {
    const url = `${this.baseUrl}/current.json?key=${this.apiKey}&q=${encodeURIComponent(city)}`;
    try {
      const response$ = this.httpService.get<CurrentWeatherResponse>(url);
      const response = await lastValueFrom(response$);
      return response.data;
    } catch (error) {
      this.handleApiError(error);
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async fetchFiveDayForecast(city: string): Promise<ForecastResponse> {
    const url = `${this.baseUrl}/forecast.json?key=${this.apiKey}&q=${encodeURIComponent(city)}&days=5`;
    try {
      const response$ = this.httpService.get<ForecastResponse>(url);
      const response = await lastValueFrom(response$);
      return response.data;
    } catch (error) {
      this.handleApiError(error);
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async fetchLocationDetails(city: string): Promise<LocationResponse> {
    const url = `${this.baseUrl}/search.json?key=${this.apiKey}&q=${encodeURIComponent(city)}`;
    try {
      const response$ = this.httpService.get<LocationResponse[]>(url);
      const response = await lastValueFrom(response$);
      return response.data[0] ?? null;
    } catch (error) {
      this.logger.error(`${error}`);
      throw new BadRequestException('Invalid Location');
    }
  }
}
