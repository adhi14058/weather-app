import { Expose, Type } from 'class-transformer';

import { ApiProperty } from '@nestjs/swagger';

export class DayDto {
  @ApiProperty({ example: 13.2 })
  @Expose()
  maxtemp_c: number;

  @ApiProperty({ example: 55.8 })
  @Expose()
  maxtemp_f: number;

  @ApiProperty({ example: 9.2 })
  @Expose()
  mintemp_c: number;

  @ApiProperty({ example: 48.6 })
  @Expose()
  mintemp_f: number;

  @ApiProperty({ example: 10.9 })
  @Expose()
  avgtemp_c: number;

  @ApiProperty({ example: 51.7 })
  @Expose()
  avgtemp_f: number;

  @ApiProperty({ example: 12.1 })
  @Expose()
  maxwind_mph: number;

  @ApiProperty({ example: 19.4 })
  @Expose()
  maxwind_kph: number;

  @ApiProperty({ example: 1.1 })
  @Expose()
  totalprecip_mm: number;

  @ApiProperty({ example: 0.04 })
  @Expose()
  totalprecip_in: number;

  @ApiProperty({ example: 10 })
  @Expose()
  avgvis_km: number;

  @ApiProperty({ example: 6 })
  @Expose()
  avgvis_miles: number;

  @ApiProperty({ example: 73 })
  @Expose()
  avghumidity: number;

  @ApiProperty({ example: 1 })
  @Expose()
  daily_will_it_rain: number;

  @ApiProperty({ example: 0 })
  @Expose()
  daily_will_it_snow: number;

  @ApiProperty({ example: 0 })
  @Expose()
  daily_chance_of_rain: number;

  @ApiProperty({ example: 0 })
  @Expose()
  daily_chance_of_snow: number;

  @ApiProperty({ example: 1 })
  @Expose()
  uv: number;
}

export class AstroDto {
  @ApiProperty({ example: '06:57 AM' })
  @Expose()
  sunrise: string;

  @ApiProperty({ example: '04:30 PM' })
  @Expose()
  sunset: string;

  @ApiProperty({ example: '01:27 PM' })
  @Expose()
  moonrise: string;

  @ApiProperty({ example: '09:45 PM' })
  @Expose()
  moonset: string;

  @ApiProperty({ example: 'Waxing Crescent' })
  @Expose()
  moon_phase: string;

  @ApiProperty({ example: '39' })
  @Expose()
  moon_illumination: string;
}

export class HourDto {
  @ApiProperty({ example: 10 })
  @Expose()
  temp_c: number;

  @ApiProperty({ example: 50 })
  @Expose()
  temp_f: number;

  @ApiProperty({ example: 12.1 })
  @Expose()
  wind_mph: number;

  @ApiProperty({ example: 19.4 })
  @Expose()
  wind_kph: number;

  @ApiProperty({ example: 229 })
  @Expose()
  wind_degree: number;

  @ApiProperty({ example: 'SW' })
  @Expose()
  wind_dir: string;

  @ApiProperty({ example: 979 })
  @Expose()
  pressure_mb: number;

  @ApiProperty({ example: 29.4 })
  @Expose()
  pressure_in: number;

  @ApiProperty({ example: 0 })
  @Expose()
  precip_mm: number;

  @ApiProperty({ example: 0 })
  @Expose()
  precip_in: number;

  @ApiProperty({ example: 69 })
  @Expose()
  humidity: number;

  @ApiProperty({ example: 39 })
  @Expose()
  cloud: number;

  @ApiProperty({ example: 7.4 })
  @Expose()
  feelslike_c: number;

  @ApiProperty({ example: 45.3 })
  @Expose()
  feelslike_f: number;

  @ApiProperty({ example: 7.4 })
  @Expose()
  windchill_c: number;

  @ApiProperty({ example: 45.3 })
  @Expose()
  windchill_f: number;
}

export class ForecastDayResponseDto {
  @ApiProperty({ example: '2019-11-03' })
  @Expose()
  date: string;

  @ApiProperty({ type: AstroDto })
  @Expose()
  @Type(() => AstroDto)
  astro: AstroDto;

  @ApiProperty({ type: [HourDto] })
  @Expose()
  @Type(() => HourDto)
  hour: HourDto[];
}

export class ForecastResponseDto {
  @ApiProperty({ type: [ForecastDayResponseDto] })
  @Type(() => ForecastDayResponseDto)
  @Expose()
  forecastday: ForecastDayResponseDto[];
}
