import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

@Expose()
export class AuthResponseDto {
  @ApiProperty({ example: 'username' })
  @Expose()
  username: string;

  @ApiProperty({ example: 'userId' })
  @Expose()
  userId: number;

  @ApiProperty({ example: 'accessToken' })
  @Expose()
  accessToken: string;
}
