/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { RegisterPayloadDto } from '../auth/dto/register-auth.dto';

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<User>;

  const mockRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserByUserName', () => {
    it('should return a user if found', async () => {
      const username = 'testuser';
      const user = {
        id: 1,
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        password: 'secret',
      };

      // Simulate repository returning the found user.
      mockRepository.findOne.mockResolvedValue(user);

      const result = await service.getUserByUserName(username);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { username },
      });
      expect(result).toEqual(user);
    });

    it('should return null if no user is found', async () => {
      const username = 'nonexistent';

      // Simulate repository returning null.
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.getUserByUserName(username);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { username },
      });
      expect(result).toBeNull();
    });
  });

  describe('insertUser', () => {
    it('should create and save a new user', async () => {
      const registerDto: RegisterPayloadDto = {
        username: 'newuser',
        firstName: 'New',
        lastName: 'User',
        password: 'password',
        confirmPassword: 'password',
      };

      const createdUser = { id: 1, ...registerDto };

      // Simulate repository.create returning the new user entity.
      mockRepository.create.mockReturnValue(createdUser);
      // Simulate repository.save returning the created user.
      mockRepository.save.mockResolvedValue(createdUser);

      const result = await service.insertUser(registerDto);

      expect(mockRepository.create).toHaveBeenCalledWith({
        username: registerDto.username,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        password: registerDto.password,
      });
      expect(mockRepository.save).toHaveBeenCalledWith(createdUser);
      expect(result).toEqual(createdUser);
    });
  });
});
