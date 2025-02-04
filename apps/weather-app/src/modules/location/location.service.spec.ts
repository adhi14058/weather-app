/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MoreThan, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { LocationService } from './location.service';
import { Location } from './entities/location.entity';
import { UserLocationService } from '../user-location/user-location.service';
import { WeatherApiProvider } from '../../core/providers/weatherApi';
import { _1_DAY_IN_MS } from '../../core/constants/time.constant';

describe('LocationService', () => {
  let service: LocationService;
  let locationRepository: Repository<Location>;
  let userLocationService: UserLocationService;
  let weatherApiProvider: WeatherApiProvider;
  let dataSource: DataSource;

  // Updated mock for Location repository including a manager property.
  const mockLocationRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    update: jest.fn(),
    manager: {
      transaction: jest.fn(async (cb: (manager: any) => Promise<any>) => {
        // Create a fake manager that returns this mock repository when asked for Location.
        const fakeManager = {
          getRepository: (token: any) => {
            if (token === Location) {
              return mockLocationRepository;
            }
            return null;
          },
        };
        return await cb(fakeManager);
      }),
    },
  };

  const mockUserLocationService = {
    findByUserId: jest.fn(),
    findByUserIdAndLocationId: jest.fn(),
    addUserLocation: jest.fn(),
    removeUserLocation: jest.fn(),
    findByLocationId: jest.fn(),
  };

  const mockWeatherApiProvider = {
    fetchLocationDetails: jest.fn(),
  };

  const mockDataSource = {
    transaction: jest.fn(async (cb: (manager: any) => Promise<any>) => {
      // Create a fake manager with a getRepository method similar to above.
      const fakeManager = {
        getRepository: (token: any) => {
          if (token === Location) {
            return mockLocationRepository;
          }
          return null;
        },
      };
      return await cb(fakeManager);
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocationService,
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
        {
          provide: getRepositoryToken(Location),
          useValue: mockLocationRepository,
        },
        {
          provide: UserLocationService,
          useValue: mockUserLocationService,
        },
        {
          provide: WeatherApiProvider,
          useValue: mockWeatherApiProvider,
        },
      ],
    }).compile();

    service = module.get<LocationService>(LocationService);
    locationRepository = module.get<Repository<Location>>(
      getRepositoryToken(Location),
    );
    userLocationService = module.get<UserLocationService>(UserLocationService);
    weatherApiProvider = module.get<WeatherApiProvider>(WeatherApiProvider);
    dataSource = module.get<DataSource>(DataSource);

    // Optionally, assert that dataSource is defined:
    expect(dataSource).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllLocationsAccessedInLastNDay', () => {
    it('should return locations accessed within the last N days', async () => {
      const locations = [{ id: 1, city: 'City1' }];
      mockLocationRepository.find.mockResolvedValue(locations);
      const days = 2;

      const result = await service.getAllLocationsAccessedInLastNDay(days);

      expect(mockLocationRepository.find).toHaveBeenCalledWith({
        where: {
          lastAccessedOn: MoreThan(
            new Date(new Date().getTime() - _1_DAY_IN_MS * days),
          ),
        },
      });
      expect(result).toEqual(locations);
    });
  });

  describe('getAllLocationsByUserId', () => {
    it('should return an array of locations for a given user', async () => {
      const userLocations = [
        { location: { id: 1, city: 'City1' } },
        { location: { id: 2, city: 'City2' } },
      ];
      mockUserLocationService.findByUserId.mockResolvedValue(userLocations);

      const result = await service.getAllLocationsByUserId(123);

      expect(mockUserLocationService.findByUserId).toHaveBeenCalledWith(123);
      expect(result).toEqual(userLocations.map((ul) => ul.location));
    });
  });

  describe('addUserLocation', () => {
    const userId = 1;

    it('should add an existing location to a user if not already added', async () => {
      const city = 'TestCity';
      const location = { id: 10, city, region: 'Region1', country: 'Country1' };

      // Simulate that a location with the given city already exists.
      mockLocationRepository.findOne.mockResolvedValue(location);
      // Simulate that the user does not have that location yet.
      mockUserLocationService.findByUserIdAndLocationId.mockResolvedValue(null);
      // Simulate a successful addition.
      mockUserLocationService.addUserLocation.mockResolvedValue(undefined);

      const result = await service.addUserLocation(userId, city);

      expect(mockLocationRepository.findOne).toHaveBeenCalledWith({
        where: { city },
      });
      expect(
        mockUserLocationService.findByUserIdAndLocationId,
      ).toHaveBeenCalledWith(userId, location.id);
      // Updated expectation: the third parameter (manager) is provided via transaction.
      expect(mockUserLocationService.addUserLocation).toHaveBeenCalledWith(
        userId,
        location.id,
        expect.any(Object),
      );
      expect(result).toEqual(location);
    });

    it('should throw ConflictException if the user location already exists', async () => {
      const city = 'TestCity';
      const location = { id: 10, city, region: 'Region1', country: 'Country1' };

      mockLocationRepository.findOne.mockResolvedValue(location);
      mockUserLocationService.findByUserIdAndLocationId.mockResolvedValue({
        id: 999,
      });

      await expect(service.addUserLocation(userId, city)).rejects.toThrow(
        ConflictException,
      );

      expect(mockLocationRepository.findOne).toHaveBeenCalledWith({
        where: { city },
      });
      expect(
        mockUserLocationService.findByUserIdAndLocationId,
      ).toHaveBeenCalledWith(userId, location.id);
    });

    it('should create a new location when it does not exist and valid details are provided by weatherApiProvider', async () => {
      const city = 'NewCity';
      mockLocationRepository.findOne.mockResolvedValue(null);
      const locationData = { region: 'RegionNew', country: 'CountryNew' };
      mockWeatherApiProvider.fetchLocationDetails.mockResolvedValue(
        locationData,
      );

      const newLocation = {
        id: 20,
        city,
        region: locationData.region,
        country: locationData.country,
      };
      mockLocationRepository.create.mockReturnValue(newLocation);
      mockLocationRepository.save.mockResolvedValue(newLocation);
      mockUserLocationService.addUserLocation.mockResolvedValue(undefined);

      const result = await service.addUserLocation(userId, city);

      expect(mockLocationRepository.findOne).toHaveBeenCalledWith({
        where: { city },
      });
      expect(mockWeatherApiProvider.fetchLocationDetails).toHaveBeenCalledWith(
        city,
      );
      expect(mockLocationRepository.create).toHaveBeenCalledWith({
        city,
        region: locationData.region,
        country: locationData.country,
      });
      expect(mockLocationRepository.save).toHaveBeenCalledWith(newLocation);
      expect(mockUserLocationService.addUserLocation).toHaveBeenCalledWith(
        userId,
        newLocation.id,
        expect.any(Object),
      );
      expect(result).toEqual(newLocation);
    });

    it('should throw BadRequestException if weatherApiProvider returns no data', async () => {
      const city = 'InvalidCity';
      mockLocationRepository.findOne.mockResolvedValue(null);
      mockWeatherApiProvider.fetchLocationDetails.mockResolvedValue(null);

      await expect(service.addUserLocation(userId, city)).rejects.toThrow(
        BadRequestException,
      );

      expect(mockLocationRepository.findOne).toHaveBeenCalledWith({
        where: { city },
      });
      expect(mockWeatherApiProvider.fetchLocationDetails).toHaveBeenCalledWith(
        city,
      );
    });
  });

  describe('removeLocation', () => {
    const userId = 1;

    it('should throw NotFoundException if the location is not found', async () => {
      const id = 999;
      mockLocationRepository.findOne.mockResolvedValue(null);

      await expect(service.removeLocation(userId, id)).rejects.toThrow(
        NotFoundException,
      );

      expect(mockLocationRepository.findOne).toHaveBeenCalledWith({
        where: { id },
      });
    });

    it('should remove the user location and delete the location if no other user locations exist', async () => {
      const id = 10;
      const location = { id, city: 'TestCity' };

      mockLocationRepository.findOne.mockResolvedValue(location);
      mockUserLocationService.removeUserLocation.mockResolvedValue(undefined);
      mockUserLocationService.findByLocationId.mockResolvedValue([]);
      mockLocationRepository.remove.mockResolvedValue(location);

      await service.removeLocation(userId, id);

      expect(mockLocationRepository.findOne).toHaveBeenCalledWith({
        where: { id },
      });
      expect(mockUserLocationService.removeUserLocation).toHaveBeenCalledWith(
        userId,
        location.id,
        expect.any(Object),
      );
      expect(mockUserLocationService.findByLocationId).toHaveBeenCalledWith(
        location.id,
        expect.any(Object),
      );
      expect(mockLocationRepository.remove).toHaveBeenCalledWith(location);
    });

    it('should not delete the location if other user locations exist', async () => {
      const id = 10;
      const location = { id, city: 'TestCity' };

      mockLocationRepository.findOne.mockResolvedValue(location);
      mockUserLocationService.removeUserLocation.mockResolvedValue(undefined);
      mockUserLocationService.findByLocationId.mockResolvedValue([{ id: 1 }]);

      await service.removeLocation(userId, id);

      expect(mockLocationRepository.findOne).toHaveBeenCalledWith({
        where: { id },
      });
      expect(mockUserLocationService.removeUserLocation).toHaveBeenCalledWith(
        userId,
        location.id,
        expect.any(Object),
      );
      expect(mockUserLocationService.findByLocationId).toHaveBeenCalledWith(
        location.id,
        expect.any(Object),
      );
      expect(mockLocationRepository.remove).not.toHaveBeenCalled();
    });
  });

  describe('updateLocationAccessedOn', () => {
    it('should update the lastAccessedOn date for a location with the given city', async () => {
      const city = 'TestCity';
      const updateResult = { affected: 1 };
      mockLocationRepository.update.mockResolvedValue(updateResult);

      const result = await service.updateLocationAccessedOn(city);

      expect(mockLocationRepository.update).toHaveBeenCalledWith(
        { city },
        { lastAccessedOn: expect.any(Date) },
      );
      expect(result).toEqual(updateResult);
    });
  });
});
