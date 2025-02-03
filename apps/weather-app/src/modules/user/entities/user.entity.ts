import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserLocation } from '../../user-location/entities/user-location.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => UserLocation, (userLocation) => userLocation.user)
  locations: UserLocation[];
}
