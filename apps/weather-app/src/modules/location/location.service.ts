import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './entities/location.entity';
import { UserLocationService } from '../user-location/user-location.service';
@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
    private userLocationService: UserLocationService,
  ) {}

  async findAllLocationsByUserId(userId: number) {
    const userLocations = await this.userLocationService.findByUserId(userId);
    const locations = userLocations.map((userLocation) => {
      return userLocation.location;
    });
    return locations;
  }

  async addUserLocation(userId: number, city: string) {
    const location = await this.locationRepository.findOne({ where: { city } });
    if (location) {
      const userLocation =
        await this.userLocationService.findByUserIdAndLocationId(
          userId,
          location.id,
        );
      if (userLocation) throw new ConflictException('Location already exists');

      await this.userLocationService.addUserLocation(userId, location.id);
      return;
    }
    const newLocation = this.locationRepository.create({ city });
    await this.locationRepository.save(newLocation);
    await this.userLocationService.addUserLocation(userId, newLocation.id);
  }

  async removeLocation(userId: number, id: number) {
    const location = await this.locationRepository.findOneOrFail({
      where: { id },
    });
    await this.userLocationService.removeUserLocation(userId, location.id);
    const result = await this.userLocationService.findByLocationId(location.id);
    if (result.length === 0) {
      await this.locationRepository.remove(location);
    }
  }
}
