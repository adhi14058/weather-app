import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getUserByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  async insert() {
    const user = this.userRepository.create({
      email: 'adhi@gmail.com',
      firstName: 'adhi',
      lastName: 'baskaran',
      password: '123456',
    });
    return this.userRepository.save(user);
  }
}
