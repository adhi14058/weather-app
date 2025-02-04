import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { Location } from './entities/location.entity';
import { UserLocationService } from '../user-location/user-location.service';
import { WeatherApiProvider } from '../../core/providers/weatherApi';
import { _1_DAY_IN_MS } from '../../core/constants/time.constant';
@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
    private userLocationService: UserLocationService,
    private weatherApiProvider: WeatherApiProvider,
  ) {}

  getAllLocationsAccessedInLastNDay(days = 1) {
    return this.locationRepository.find({
      where: {
        lastAccessedOn: MoreThan(
          new Date(new Date().getTime() - _1_DAY_IN_MS * days),
        ),
      },
    });
  }

  async getAllLocationsByUserId(userId: number) {
    const userLocations = await this.userLocationService.findByUserId(userId);
    const locations = userLocations.map((userLocation) => {
      return userLocation.location;
    });
    return locations;
  }

  async addUserLocation(userId: number, city: string): Promise<Location> {
    return await this.locationRepository.manager.transaction(
      async (manager) => {
        // Use the transactional repository for Location operations.
        const locationRepo = manager.getRepository(Location);

        // Check if the location already exists.
        const location = await locationRepo.findOne({ where: { city } });
        if (location) {
          const userLocation =
            await this.userLocationService.findByUserIdAndLocationId(userId, location.id); //prettier-ignore
          if (userLocation) {
            throw new ConflictException('Location already exists');
          }
          // Pass the transaction's manager so that this call runs in the same transaction.
          await this.userLocationService.addUserLocation(userId, location.id, manager); //prettier-ignore
          return location;
        }

        // If the location does not exist, fetch details from the weather API.
        const locationData = await this.weatherApiProvider.fetchLocationDetails(city); //prettier-ignore
        if (!locationData) {
          throw new BadRequestException('Invalid Location');
        }
        // Create and save the new location using the transactional repository.
        const newLocation = locationRepo.create({
          city,
          region: locationData.region,
          country: locationData.country,
        });
        await locationRepo.save(newLocation);
        // Again, pass the manager for transactional consistency.
        await this.userLocationService.addUserLocation(
          userId,
          newLocation.id,
          manager,
        );
        return newLocation;
      },
    );
  }

  async removeLocation(userId: number, id: number) {
    return await this.locationRepository.manager.transaction(
      async (manager) => {
        const locationRepo = manager.getRepository(Location);
        const location = await locationRepo.findOne({ where: { id } });
        if (!location) {
          throw new NotFoundException('Location not found');
        }
        await this.userLocationService.removeUserLocation(userId, location.id, manager); //prettier-ignore
        const result = await this.userLocationService.findByLocationId(location.id, manager); //prettier-ignore
        if (result.length === 0) {
          await locationRepo.remove(location);
        }
      },
    );
  }

  updateLocationAccessedOn(city: string) {
    return this.locationRepository.update(
      { city },
      { lastAccessedOn: new Date() },
    );
  }
}
