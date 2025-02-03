import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthPayloadDto } from './dto/login-auth.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '../../core/guards/auth.guard';
import { AuthUser } from '../../core/decorators/user.decorator';
import { IAuthUser } from './types/auth.types';
import { RegisterPayloadDto } from './dto/register-auth.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthResponseDto } from './dto/response-auth.dto';
import { plainToInstance } from 'class-transformer';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({
  strategy: 'excludeAll',
  excludeExtraneousValues: true,
})
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() { username, password }: AuthPayloadDto) {
    const auth = await this.authService.authenticate({ username, password });
    return plainToInstance(AuthResponseDto, auth);
  }

  @Post('register')
  @HttpCode(HttpStatus.OK)
  async register(@Body() registerDto: RegisterPayloadDto) {
    const auth = await this.authService.register(registerDto);
    return plainToInstance(AuthResponseDto, auth);
  }

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  status(@AuthUser() user: IAuthUser) {
    return plainToInstance(AuthResponseDto, user);
  }
}
