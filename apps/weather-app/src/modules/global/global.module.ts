import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { WeatherApiProvider } from '../../core/providers/weatherApi';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
  providers: [WeatherApiProvider],
  imports: [
    HttpModule,
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [HttpModule, WeatherApiProvider, JwtModule],
})
export class GlobalModule {}
