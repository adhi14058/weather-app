import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { RegisterPayloadDto } from '../auth/dto/register-auth.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getUserByUserName(username: string) {
    return this.userRepository.findOne({ where: { username } });
  }

  async insertUser(registerDto: RegisterPayloadDto) {
    const userEntity = this.userRepository.create({
      username: registerDto.username,
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      password: registerDto.password,
    });
    return this.userRepository.save(userEntity);
  }
}
