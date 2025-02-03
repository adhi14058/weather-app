import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserLocation } from '../../user-location/entities/user-location.entity';

@Entity()
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index()
  city: string;

  @Column()
  region: string;

  @Column()
  country: string;

  @Column({ default: new Date() })
  lastAccessedOn: Date;

  @OneToMany(() => UserLocation, (userLocation) => userLocation.location)
  userLocations: UserLocation[];
}
