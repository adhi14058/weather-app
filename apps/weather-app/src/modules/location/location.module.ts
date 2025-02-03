import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from './entities/location.entity';
import { LocationController } from './location.controller';
import { UserLocationModule } from '../user-location/user-location.module';

@Module({
  imports: [TypeOrmModule.forFeature([Location]), UserLocationModule],
  controllers: [LocationController],
  providers: [LocationService],
})
export class LocationModule {}
