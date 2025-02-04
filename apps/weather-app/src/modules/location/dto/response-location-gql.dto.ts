import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { ForecastResponseDto } from '../../weather/dto/response-forecast.dto';
import { WeatherResponseDto } from '../../weather/dto/response-weather.dto';

@ObjectType()
export class LocationResponseGqlDto {
  @ApiProperty({ example: 123 })
  @Field(() => Int)
  id: number;

  @Field()
  city: string;

  @Field()
  region: string;

  @Field()
  country: string;

  @Field(() => ForecastResponseDto, { nullable: true })
  forecast?: ForecastResponseDto;

  @Field(() => WeatherResponseDto, { nullable: true })
  weather?: WeatherResponseDto;
}
