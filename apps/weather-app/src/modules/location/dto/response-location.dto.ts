import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { ForecastResponseDto } from '../../weather/dto/response-forecast.dto';
import { WeatherResponseDto } from '../../weather/dto/response-weather.dto';

@Expose()
@ObjectType()
export class LocationResponseDto {
  @ApiProperty({ example: 123 })
  @Expose()
  @Field(() => Int)
  id: number;

  @ApiProperty({ example: 'Dubai' })
  @Expose()
  @Field()
  city: string;

  @ApiProperty({ example: 'Dubai' })
  @Expose()
  @Field()
  region: string;

  @ApiProperty({ example: 'United Arab Emirates' })
  @Expose()
  @Field()
  country: string;

  @Exclude()
  @ApiProperty({ nullable: true })
  @Field(() => ForecastResponseDto, { nullable: true })
  forecast?: ForecastResponseDto;

  @Exclude()
  @ApiProperty({ nullable: true })
  @Field(() => WeatherResponseDto, { nullable: true })
  weather?: WeatherResponseDto;
}
