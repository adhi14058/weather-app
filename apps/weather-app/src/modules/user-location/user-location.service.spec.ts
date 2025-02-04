/* eslint-disable @typescript-eslint/no-unused-vars */
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserLocation } from './entities/user-location.entity';
import { UserLocationService } from './user-location.service';

describe('UserLocationService', () => {
  let service: UserLocationService;
  let repository: Repository<UserLocation>;

  // Create a mock repository for UserLocation using Jest
  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserLocationService,
        {
          provide: getRepositoryToken(UserLocation),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UserLocationService>(UserLocationService);
    repository = module.get<Repository<UserLocation>>(
      getRepositoryToken(UserLocation),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findByUserId', () => {
    it('should return all user locations for a given userId with the "location" relation', async () => {
      const userId = 1;
      const userLocations = [
        { id: 1, userId, location: { id: 100, name: 'Test Location' } },
      ];
      mockRepository.find.mockResolvedValue(userLocations);

      const result = await service.findByUserId(userId);

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { userId },
        relations: ['location'],
      });
      expect(result).toEqual(userLocations);
    });
  });

  describe('findByLocationId', () => {
    it('should return all user locations for a given locationId with the "user" relation', async () => {
      const locationId = 2;
      const userLocations = [
        { id: 1, locationId, user: { id: 10, name: 'Test User' } },
      ];
      mockRepository.find.mockResolvedValue(userLocations);

      const result = await service.findByLocationId(locationId);

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { locationId },
        relations: ['user'],
      });
      expect(result).toEqual(userLocations);
    });
  });

  describe('findByUserIdAndLocationId', () => {
    it('should return a single user location matching the userId and locationId with both relations loaded', async () => {
      const userId = 1;
      const locationId = 2;
      const userLocation = {
        id: 1,
        userId,
        locationId,
        user: { id: 10, name: 'Test User' },
        location: { id: 100, name: 'Test Location' },
      };
      mockRepository.findOne.mockResolvedValue(userLocation);

      const result = await service.findByUserIdAndLocationId(
        userId,
        locationId,
      );

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { userId, locationId },
        relations: ['user', 'location'],
      });
      expect(result).toEqual(userLocation);
    });
  });

  describe('addUserLocation', () => {
    it('should create and save a new user location', async () => {
      const userId = 1;
      const locationId = 2;
      const newUserLocation = { userId, locationId };

      // Simulate repository.create and repository.save
      mockRepository.create.mockReturnValue(newUserLocation);
      mockRepository.save.mockResolvedValue(newUserLocation);

      const result = await service.addUserLocation(userId, locationId);

      expect(mockRepository.create).toHaveBeenCalledWith({
        userId,
        locationId,
      });
      expect(mockRepository.save).toHaveBeenCalledWith(newUserLocation);
      expect(result).toEqual(newUserLocation);
    });
  });

  describe('removeUserLocation', () => {
    it('should remove the user location if it exists', async () => {
      const userId = 1;
      const locationId = 2;
      const existingUserLocation = { id: 1, userId, locationId };

      // First, find the existing record then remove it
      mockRepository.findOne.mockResolvedValue(existingUserLocation);
      mockRepository.remove.mockResolvedValue(existingUserLocation);

      const result = await service.removeUserLocation(userId, locationId);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { userId, locationId },
        relations: ['user', 'location'],
      });
      expect(mockRepository.remove).toHaveBeenCalledWith(existingUserLocation);
      expect(result).toEqual(existingUserLocation);
    });

    it('should throw NotFoundException if the user location does not exist', async () => {
      const userId = 1;
      const locationId = 2;

      // Simulate a non-existing record
      mockRepository.findOne.mockResolvedValue(null);

      await expect(
        service.removeUserLocation(userId, locationId),
      ).rejects.toThrow(NotFoundException);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { userId, locationId },
        relations: ['user', 'location'],
      });
      expect(mockRepository.remove).not.toHaveBeenCalled();
    });
  });
});
