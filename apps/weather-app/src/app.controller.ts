import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './core/guards/auth.guard';
import { WeatherApiProvider } from './core/providers/weatherApi';
import { UserService } from './modules/user/user.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly weatherApi: WeatherApiProvider,
    private readonly userService: UserService,
  ) {}

  @Get()
  @UseGuards(AuthGuard)
  getHello() {
    // return this.userService.insert('Adhi');
    return this.weatherApi.fetch5DayForecast('mumbai');
  }
}
