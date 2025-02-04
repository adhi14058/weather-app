import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { UserLocation } from './entities/user-location.entity';

@Injectable()
export class UserLocationService {
  constructor(
    @InjectRepository(UserLocation)
    private userLocationRepository: Repository<UserLocation>,
  ) {}

  async findByUserId(userId: number, manager?: EntityManager) {
    const repo: Repository<UserLocation> = manager
      ? manager.getRepository(UserLocation)
      : this.userLocationRepository;

    return repo.find({
      where: { userId },
      relations: ['location'],
      order: { locationId: 'ASC' },
    });
  }

  async findByLocationId(locationId: number, manager?: EntityManager) {
    const repo: Repository<UserLocation> = manager
      ? manager.getRepository(UserLocation)
      : this.userLocationRepository;
    return repo.find({
      where: { locationId },
      relations: ['user'],
    });
  }

  async findByUserIdAndLocationId(
    userId: number,
    locationId: number,
    manager?: EntityManager,
  ) {
    const repo: Repository<UserLocation> = manager
      ? manager.getRepository(UserLocation)
      : this.userLocationRepository;

    return repo.findOne({
      where: { userId, locationId },
      relations: ['user', 'location'],
    });
  }

  async addUserLocation(
    userId: number,
    locationId: number,
    manager?: EntityManager,
  ) {
    const repo: Repository<UserLocation> = manager
      ? manager.getRepository(UserLocation)
      : this.userLocationRepository;

    const userLocation = repo.create({
      userId,
      locationId,
    });
    await repo.save(userLocation);
    return userLocation;
  }

  async removeUserLocation(
    userId: number,
    locationId: number,
    manager?: EntityManager,
  ) {
    const repo: Repository<UserLocation> = manager
      ? manager.getRepository(UserLocation)
      : this.userLocationRepository;

    const entity = await this.findByUserIdAndLocationId(userId, locationId, manager); //prettier-ignore
    if (!entity) {
      throw new NotFoundException('Location not marked as favourite');
    }
    return repo.remove(entity);
  }
}
