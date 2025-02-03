import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { LocationService } from './location.service';
import { AuthGuard } from '../../core/guards/auth.guard';
import { AuthUser } from '../../core/decorators/user.decorator';
import { CustomLogger } from '../../core/utils/CustomLogger';
import { CreateLocationDto } from './dto/create-location.dto';

@Controller('locations')
@UseGuards(AuthGuard)
export class LocationController {
  private readonly logger = new CustomLogger(LocationController.name);
  constructor(private readonly locationService: LocationService) {}
  @Get()
  findAllLocations(@AuthUser() user: { id: number }) {
    this.logger.log(`Find all locations for user ${user.id}`);
    return this.locationService.findAllLocationsByUserId(user.id);
  }

  @Post()
  insertLocation(
    @AuthUser() user: { id: number },
    @Body() locationDto: CreateLocationDto,
  ) {
    this.logger.log(`Adding favourite location for user ${user.id}`);
    return this.locationService.addUserLocation(user.id, locationDto.city);
  }

  @Delete(':id')
  removeLocation(
    @AuthUser() user: { id: number },
    @Param('id', ParseIntPipe) id: number,
  ) {
    this.logger.log(`Removing favourite location for user ${user.id}`);
    return this.locationService.removeLocation(user.id, id);
  }
}
