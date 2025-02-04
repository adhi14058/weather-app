import { Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { LocationService } from './location.service';
import { AuthGuard } from '../../core/guards/auth.guard';
import { UseGuards } from '@nestjs/common';
import { AuthUser } from '../../core/decorators/user.decorator';
import { IAuthUser } from '../auth/types/auth.types';
import { WeatherResponseDto } from '../weather/dto/response-weather.dto';
import { ForecastResponseDto } from '../weather/dto/response-forecast.dto';
import { WeatherService } from '../weather/weather.service';
import { LocationResponseGqlDto } from './dto/response-location-gql.dto';

@Resolver(() => LocationResponseGqlDto)
@UseGuards(AuthGuard)
export class LocationResolver {
  constructor(
    private readonly locationService: LocationService,
    private readonly weatherService: WeatherService,
  ) {}

  @Query(() => [LocationResponseGqlDto], { nullable: true })
  async location(@AuthUser() { userId }: IAuthUser) {
    return this.locationService.getAllLocationsByUserId(userId);
  }

  @ResolveField(() => WeatherResponseDto)
  async weather(@Parent() { city }: LocationResponseGqlDto) {
    const weather = await this.weatherService.getCurrentWeatherByLocation(city);
    return weather;
  }

  @ResolveField(() => ForecastResponseDto)
  async forecast(@Parent() { city }: LocationResponseGqlDto) {
    return this.weatherService.getFiveDayForecastByLocation(city);
  }
}
