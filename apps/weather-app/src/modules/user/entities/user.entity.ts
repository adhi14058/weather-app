import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserLocation } from '../../user-location/entities/user-location.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column()
  password: string;

  @OneToMany(() => UserLocation, (userLocation) => userLocation.user)
  locations: UserLocation[];
}
