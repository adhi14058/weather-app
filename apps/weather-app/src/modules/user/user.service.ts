import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { RegisterPayloadDto } from '../auth/dto/register-auth.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getUserByUserName(username: string, manager?: EntityManager) {
    const repo: Repository<User> = manager
      ? manager.getRepository(User)
      : this.userRepository;
    return repo.findOne({ where: { username } });
  }

  async insertUser(registerDto: RegisterPayloadDto, manager?: EntityManager) {
    const repo: Repository<User> = manager
      ? manager.getRepository(User)
      : this.userRepository;
    const userEntity = repo.create({
      username: registerDto.username,
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      password: registerDto.password,
    });
    return repo.save(userEntity);
  }
}
