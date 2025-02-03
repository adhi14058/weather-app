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
import { CustomLogger } from '../../core/utils/CustomLogger';
import { _1_DAY_IN_MS } from '../../core/constants/time.constant';
@Injectable()
export class LocationService {
  private readonly logger = new CustomLogger(LocationService.name);
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
    const location = await this.locationRepository.findOne({ where: { city } });
    if (location) {
      const userLocation =
        await this.userLocationService.findByUserIdAndLocationId(userId, location.id); //prettier-ignore
      if (userLocation) {
        throw new ConflictException('Location already exists');
      }

      await this.userLocationService.addUserLocation(userId, location.id);
      return location;
    }
    const locationData = await this.weatherApiProvider.fetchLocationDetails(city); //prettier-ignore
    if (!locationData) throw new BadRequestException('Invalid Location');
    const newLocation = this.locationRepository.create({
      city,
      region: locationData.region,
      country: locationData.country,
    });
    await this.locationRepository.save(newLocation);
    await this.userLocationService.addUserLocation(userId, newLocation.id);
    return newLocation;
  }

  async removeLocation(userId: number, id: number) {
    const location = await this.locationRepository.findOne({ where: { id } });
    if (!location) {
      throw new NotFoundException('Location not found');
    }
    await this.userLocationService.removeUserLocation(userId, location.id);
    const result = await this.userLocationService.findByLocationId(location.id);
    if (result.length === 0) {
      await this.locationRepository.remove(location);
    }
  }

  updateLocationAccessedOn(city: string) {
    return this.locationRepository.update(
      { city },
      { lastAccessedOn: new Date() },
    );
  }
}
