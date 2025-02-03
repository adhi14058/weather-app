import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { LocationService } from './location.service';
import { AuthGuard } from '../../core/guards/auth.guard';
import { AuthUser } from '../../core/decorators/user.decorator';
import { CustomLogger } from '../../core/utils/CustomLogger';
import { CreateLocationDto } from './dto/create-location.dto';
import { LocationResponseDto } from './dto/response-location.dto';
import { plainToInstance } from 'class-transformer';

@Controller('locations')
@UseGuards(AuthGuard)
export class LocationController {
  private readonly logger = new CustomLogger(LocationController.name);
  constructor(private readonly locationService: LocationService) {}
  @Get()
  async findAllLocations(@AuthUser() user: { id: number }) {
    this.logger.log(`Find all favourite locations for user ${user.id}`);
    const locations = await this.locationService.getAllLocationsByUserId(user.id); //prettier-ignore
    return plainToInstance(LocationResponseDto, locations);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  async insertLocation(
    @AuthUser() user: { id: number },
    @Body() locationDto: CreateLocationDto,
  ) {
    this.logger.log(`Adding favourite location for user ${user.id}`);
    const location = await this.locationService.addUserLocation(user.id, locationDto.city); //prettier-ignore
    return plainToInstance(LocationResponseDto, location);
  }

  @Delete(':id')
  async removeLocation(
    @AuthUser() user: { id: number },
    @Param('id', ParseIntPipe) id: number,
  ) {
    this.logger.log(`Removing favourite location for user ${user.id}`);
    await this.locationService.removeLocation(user.id, id);
  }
}
