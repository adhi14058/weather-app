import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Location } from '../../location/entities/location.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
export class UserLocation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.locations)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  locationId: number;

  @ManyToOne(() => Location, (location) => location.userLocations)
  @JoinColumn({ name: 'locationId' })
  location: Location;
}
