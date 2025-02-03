import { Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { LocationService } from './location.service';
import { AuthGuard } from '../../core/guards/auth.guard';
import { UseGuards } from '@nestjs/common';
import { LocationResponseDto } from './dto/response-location.dto';
import { AuthUser } from '../../core/decorators/user.decorator';
import { IAuthUser } from '../auth/types/auth.types';
import { WeatherResponseDto } from '../weather/dto/response-weather.dto';
import { ForecastResponseDto } from '../weather/dto/response-forecast.dto';
import { WeatherService } from '../weather/weather.service';

@Resolver(() => LocationResponseDto)
@UseGuards(AuthGuard)
export class LocationResolver {
  constructor(
    private readonly locationService: LocationService,
    private readonly weatherService: WeatherService,
  ) {}

  @Query(() => [LocationResponseDto], { nullable: true })
  async location(@AuthUser() { userId }: IAuthUser) {
    return this.locationService.getAllLocationsByUserId(userId);
  }

  @ResolveField(() => WeatherResponseDto)
  async weather(@Parent() { city }: LocationResponseDto) {
    const weather = await this.weatherService.getCurrentWeatherByLocation(city);
    return weather;
  }

  @ResolveField(() => ForecastResponseDto)
  async forecast(@Parent() { city }: LocationResponseDto) {
    return this.weatherService.getFiveDayForecastByLocation(city);
  }
}
