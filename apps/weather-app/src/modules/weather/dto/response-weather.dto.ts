import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class WeatherResponseDto {
  @ApiProperty({ example: 15.2, description: 'Temperature in Celsius' })
  @Expose()
  'temp_c': number;

  @ApiProperty({ example: 59.4, description: 'Temperature in Fahrenheit' })
  @Expose()
  'temp_f': number;

  @ApiProperty({ example: 7.8, description: 'Wind speed in miles per hour' })
  @Expose()
  'wind_mph': number;

  @ApiProperty({
    example: 12.6,
    description: 'Wind speed in kilometers per hour',
  })
  @Expose()
  'wind_kph': number;

  @ApiProperty({ example: 200, description: 'Wind direction in degrees' })
  @Expose()
  'wind_degree': number;

  @ApiProperty({ example: 'NW', description: 'Wind direction as a string' })
  @Expose()
  'wind_dir': string;

  @ApiProperty({
    example: 1013,
    description: 'Atmospheric pressure in millibars',
  })
  @Expose()
  'pressure_mb': number;

  @ApiProperty({
    example: 29.91,
    description: 'Atmospheric pressure in inches',
  })
  @Expose()
  'pressure_in': number;

  @ApiProperty({ example: 75, description: 'Humidity percentage' })
  @Expose()
  'humidity': number;

  @ApiProperty({
    example: 14,
    description: 'Feels-like temperature in Celsius',
  })
  @Expose()
  'feelslike_c': number;

  @ApiProperty({
    example: 57.2,
    description: 'Feels-like temperature in Fahrenheit',
  })
  @Expose()
  'feelslike_f': number;

  @ApiProperty({ example: 13, description: 'Wind chill in Celsius' })
  @Expose()
  'windchill_c': number;

  @ApiProperty({ example: 55.4, description: 'Wind chill in Fahrenheit' })
  @Expose()
  'windchill_f': number;
}
