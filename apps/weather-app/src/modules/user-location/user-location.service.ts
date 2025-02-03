import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserLocation } from './entities/user-location.entity';

@Injectable()
export class UserLocationService {
  constructor(
    @InjectRepository(UserLocation)
    private userLocationRepository: Repository<UserLocation>,
  ) {}

  async findByUserId(userId: number) {
    return this.userLocationRepository.find({
      where: { userId },
      relations: ['location'],
    });
  }

  async findByLocationId(locationId: number) {
    return this.userLocationRepository.find({
      where: { locationId },
      relations: ['user'],
    });
  }

  async findByUserIdAndLocationId(userId: number, locationId: number) {
    return this.userLocationRepository.findOne({
      where: { userId, locationId },
      relations: ['user', 'location'],
    });
  }

  async addUserLocation(userId: number, locationId: number) {
    const userLocation = this.userLocationRepository.create({
      userId,
      locationId,
    });
    await this.userLocationRepository.save(userLocation);
    return userLocation;
  }

  async removeUserLocation(userId: number, locationId: number) {
    const entity = await this.findByUserIdAndLocationId(userId, locationId);
    if (!entity) {
      throw new NotFoundException('Location not marked as favourite');
    }
    return this.userLocationRepository.remove(entity);
  }
}
