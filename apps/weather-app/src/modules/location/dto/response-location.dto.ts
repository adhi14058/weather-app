import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

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
}
