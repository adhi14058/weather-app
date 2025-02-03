import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Field, ObjectType, Float } from '@nestjs/graphql';

@ObjectType()
export class WeatherResponseDto {
  @ApiProperty({ example: 15.2, description: 'Temperature in Celsius' })
  @Expose()
  @Field(() => Float)
  'temp_c': number;

  @ApiProperty({ example: 59.4, description: 'Temperature in Fahrenheit' })
  @Expose()
  @Field(() => Float)
  'temp_f': number;

  @ApiProperty({ example: 7.8, description: 'Wind speed in miles per hour' })
  @Expose()
  @Field(() => Float)
  'wind_mph': number;

  @ApiProperty({
    example: 12.6,
    description: 'Wind speed in kilometers per hour',
  })
  @Expose()
  @Field(() => Float)
  'wind_kph': number;

  @ApiProperty({ example: 200, description: 'Wind direction in degrees' })
  @Expose()
  @Field(() => Float)
  'wind_degree': number;

  @ApiProperty({ example: 'NW', description: 'Wind direction as a string' })
  @Expose()
  @Field()
  'wind_dir': string;

  @ApiProperty({
    example: 1013,
    description: 'Atmospheric pressure in millibars',
  })
  @Expose()
  @Field(() => Float)
  'pressure_mb': number;

  @ApiProperty({
    example: 29.91,
    description: 'Atmospheric pressure in inches',
  })
  @Expose()
  @Field(() => Float)
  'pressure_in': number;

  @ApiProperty({ example: 75, description: 'Humidity percentage' })
  @Expose()
  @Field(() => Float)
  'humidity': number;

  @ApiProperty({
    example: 14,
    description: 'Feels-like temperature in Celsius',
  })
  @Expose()
  @Field(() => Float)
  'feelslike_c': number;

  @ApiProperty({
    example: 57.2,
    description: 'Feels-like temperature in Fahrenheit',
  })
  @Expose()
  @Field(() => Float)
  'feelslike_f': number;

  @ApiProperty({ example: 13, description: 'Wind chill in Celsius' })
  @Expose()
  @Field(() => Float)
  'windchill_c': number;

  @ApiProperty({ example: 55.4, description: 'Wind chill in Fahrenheit' })
  @Expose()
  @Field(() => Float)
  'windchill_f': number;
}
