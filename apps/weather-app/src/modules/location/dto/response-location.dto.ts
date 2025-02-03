import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

@Expose()
export class LocationResponseDto {
  @ApiProperty({ example: 123 })
  @Expose()
  id: number;

  @ApiProperty({ example: 'Dubai' })
  @Expose()
  city: string;

  @ApiProperty({ example: 'Dubai' })
  @Expose()
  region: string;

  @ApiProperty({ example: 'United Arab Emirates' })
  @Expose()
  country: string;
}
