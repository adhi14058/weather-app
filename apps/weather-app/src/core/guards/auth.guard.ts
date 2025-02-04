import { UserService } from './../../modules/user/user.service';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { IAuthUser, TokenPayload } from '../../modules/auth/types/auth.types';
import { getRequestResponseFromContext } from '../utils';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { req } = getRequestResponseFromContext(context);

    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      throw new UnauthorizedException('No authorization header provided');
    }

    // Expected format: "Bearer <token>"
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new UnauthorizedException('Invalid authorization header format');
    }
    const token = parts[1];
    try {
      const tokenPayload: TokenPayload = await this.jwtService.verifyAsync(token); //prettier-ignore
      req.user = {
        userId: tokenPayload.sub,
        username: tokenPayload.username,
      } as IAuthUser;
      const user = await this.userService.getUserByUserName(tokenPayload.username); //prettier-ignore
      if (!user) {
        throw new UnauthorizedException('Invalid user');
      }

      return true;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
