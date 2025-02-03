import { Controller, Get, Post, Body, Param, Delete, UseGuards, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common'; //prettier-ignore
import { LocationService } from './location.service';
import { AuthGuard } from '../../core/guards/auth.guard';
import { AuthUser } from '../../core/decorators/user.decorator';
import { CustomLogger } from '../../core/utils/CustomLogger';
import { CreateLocationDto } from './dto/create-location.dto';
import { LocationResponseDto } from './dto/response-location.dto';
import { plainToInstance } from 'class-transformer';
import { ApiBearerAuth } from '@nestjs/swagger';
import { IAuthUser } from '../auth/types/auth.types';

@Controller('locations')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class LocationController {
  private readonly logger = new CustomLogger(LocationController.name);
  constructor(private readonly locationService: LocationService) {}

  @Get()
  async findAllLocations(@AuthUser() { userId }: IAuthUser) {
    this.logger.log(`Find all favourite locations for user ${userId}`);
    const locations = await this.locationService.getAllLocationsByUserId(userId); //prettier-ignore
    return plainToInstance(LocationResponseDto, locations);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  async insertLocation(
    @AuthUser() { userId }: IAuthUser,
    @Body() locationDto: CreateLocationDto,
  ) {
    this.logger.log(`Adding favourite location for user ${userId}`);
    const location = await this.locationService.addUserLocation(userId, locationDto.city); //prettier-ignore
    return plainToInstance(LocationResponseDto, location);
  }

  @Delete(':id')
  async removeLocation(
    @AuthUser() { userId }: IAuthUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    this.logger.log(`Removing favourite location for user ${userId}`);
    await this.locationService.removeLocation(userId, id);
  }
}
