import { Module } from '@nestjs/common';
import { UserLocationService } from './user-location.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserLocation } from './entities/user-location.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserLocation])],
  controllers: [],
  providers: [UserLocationService],
  exports: [UserLocationService],
})
export class UserLocationModule {}
