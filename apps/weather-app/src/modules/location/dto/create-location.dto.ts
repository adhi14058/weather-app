import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateLocationDto {
  @IsString()
  @IsNotEmpty()
  @Field()
  city: string;
}
