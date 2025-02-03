import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Field, Float, ObjectType } from '@nestjs/graphql';
@ObjectType()
export class DayDto {
  @ApiProperty({ example: 13.2 })
  @Expose()
  @Field(() => Float)
  maxtemp_c: number;

  @ApiProperty({ example: 55.8 })
  @Expose()
  @Field(() => Float)
  maxtemp_f: number;

  @ApiProperty({ example: 9.2 })
  @Expose()
  @Field(() => Float)
  mintemp_c: number;

  @ApiProperty({ example: 48.6 })
  @Expose()
  @Field(() => Float)
  mintemp_f: number;

  @ApiProperty({ example: 10.9 })
  @Expose()
  @Field(() => Float)
  avgtemp_c: number;

  @ApiProperty({ example: 51.7 })
  @Expose()
  @Field(() => Float)
  avgtemp_f: number;

  @ApiProperty({ example: 12.1 })
  @Expose()
  @Field(() => Float)
  maxwind_mph: number;

  @ApiProperty({ example: 19.4 })
  @Expose()
  @Field(() => Float)
  maxwind_kph: number;

  @ApiProperty({ example: 1.1 })
  @Expose()
  @Field(() => Float)
  totalprecip_mm: number;

  @ApiProperty({ example: 0.04 })
  @Expose()
  @Field(() => Float)
  totalprecip_in: number;

  @ApiProperty({ example: 10 })
  @Expose()
  @Field(() => Float)
  avgvis_km: number;

  @ApiProperty({ example: 6 })
  @Expose()
  @Field(() => Float)
  avgvis_miles: number;

  @ApiProperty({ example: 73 })
  @Expose()
  @Field(() => Float)
  avghumidity: number;

  @ApiProperty({ example: 1 })
  @Expose()
  @Field(() => Float)
  daily_will_it_rain: number;

  @ApiProperty({ example: 0 })
  @Expose()
  @Field(() => Float)
  daily_will_it_snow: number;

  @ApiProperty({ example: 0 })
  @Expose()
  @Field(() => Float)
  daily_chance_of_rain: number;

  @ApiProperty({ example: 0 })
  @Expose()
  @Field(() => Float)
  daily_chance_of_snow: number;

  @ApiProperty({ example: 1 })
  @Expose()
  @Field(() => Float)
  uv: number;
}
@ObjectType()
export class AstroDto {
  @ApiProperty({ example: '06:57 AM' })
  @Expose()
  @Field()
  sunrise: string;

  @ApiProperty({ example: '04:30 PM' })
  @Expose()
  @Field()
  sunset: string;

  @ApiProperty({ example: '01:27 PM' })
  @Expose()
  @Field()
  moonrise: string;

  @ApiProperty({ example: '09:45 PM' })
  @Expose()
  @Field()
  moonset: string;

  @ApiProperty({ example: 'Waxing Crescent' })
  @Expose()
  @Field()
  moon_phase: string;

  @ApiProperty({ example: '39' })
  @Expose()
  @Field()
  moon_illumination: string;
}

@ObjectType()
export class HourDto {
  @ApiProperty({ example: '10:00' })
  @Expose()
  @Field()
  time: string;

  @ApiProperty({ example: 10 })
  @Expose()
  @Field(() => Float)
  temp_c: number;

  @ApiProperty({ example: 50 })
  @Expose()
  @Field(() => Float)
  temp_f: number;

  @ApiProperty({ example: 12.1 })
  @Expose()
  @Field(() => Float)
  wind_mph: number;

  @ApiProperty({ example: 19.4 })
  @Expose()
  @Field(() => Float)
  wind_kph: number;

  @ApiProperty({ example: 229 })
  @Expose()
  @Field(() => Float)
  wind_degree: number;

  @ApiProperty({ example: 'SW' })
  @Expose()
  @Field()
  wind_dir: string;

  @ApiProperty({ example: 979 })
  @Expose()
  @Field(() => Float)
  pressure_mb: number;

  @ApiProperty({ example: 29.4 })
  @Expose()
  @Field(() => Float)
  pressure_in: number;

  @ApiProperty({ example: 0 })
  @Expose()
  @Field(() => Float)
  precip_mm: number;

  @ApiProperty({ example: 0 })
  @Expose()
  @Field(() => Float)
  precip_in: number;

  @ApiProperty({ example: 69 })
  @Expose()
  @Field(() => Float)
  humidity: number;

  @ApiProperty({ example: 39 })
  @Expose()
  @Field(() => Float)
  cloud: number;

  @ApiProperty({ example: 7.4 })
  @Expose()
  @Field(() => Float)
  feelslike_c: number;

  @ApiProperty({ example: 45.3 })
  @Expose()
  @Field(() => Float)
  feelslike_f: number;

  @ApiProperty({ example: 7.4 })
  @Expose()
  @Field(() => Float)
  windchill_c: number;

  @ApiProperty({ example: 45.3 })
  @Expose()
  @Field(() => Float)
  windchill_f: number;
}

@ObjectType()
export class ForecastDayResponseDto {
  @ApiProperty({ example: '2019-11-03' })
  @Expose()
  @Field()
  date: string;

  @ApiProperty({ type: AstroDto })
  @Expose()
  @Type(() => AstroDto)
  @Field(() => AstroDto)
  astro: AstroDto;

  @ApiProperty({ type: [HourDto] })
  @Expose()
  @Type(() => HourDto)
  @Field(() => [HourDto])
  hour: HourDto[];
}

@ObjectType()
export class ForecastResponseDto {
  @ApiProperty({ type: [ForecastDayResponseDto] })
  @Type(() => ForecastDayResponseDto)
  @Expose()
  @Field(() => [ForecastDayResponseDto])
  forecastday: ForecastDayResponseDto[];
}
