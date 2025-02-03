import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthPayloadDto } from './dto/login-auth.dto';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { TokenPayload } from './types/auth.types';
import { RegisterPayloadDto } from './dto/register-auth.dto';
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async authenticate(payload: AuthPayloadDto) {
    const user = await this.validateUser(payload);
    if (!user) {
      throw new UnauthorizedException();
    }
    const accessToken = await this.jwtService.signAsync({
      sub: user.userId,
      username: user.username,
    } as TokenPayload);
    return { accessToken, ...user };
  }

  async register(registerDto: RegisterPayloadDto) {
    const user = await this.userService.getUserByUserName(registerDto.username);
    if (user) {
      throw new BadRequestException('Username already exists');
    }
    if (registerDto.password !== registerDto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const userData = {
      ...registerDto,
      password: hashedPassword,
    };
    await this.userService.insertUser(userData);
    return this.authenticate({
      username: registerDto.username,
      password: registerDto.password,
    });
  }

  private async validateUser({ username, password }: AuthPayloadDto) {
    const user = await this.userService.getUserByUserName(username);
    if (!user) {
      return null;
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return null;
    }
    const payload = { username: user.username, userId: user.id };
    return payload;
  }
}
