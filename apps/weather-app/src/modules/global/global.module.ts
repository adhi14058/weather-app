import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [HttpModule, ConfigModule],
  exports: [HttpModule, ConfigModule],
})
export class GlobalModule {}
