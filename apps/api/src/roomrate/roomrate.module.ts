import { Module } from '@nestjs/common';
import { RoomrateService } from './roomrate.service';
import { RoomrateController } from './roomrate.controller';

@Module({
  controllers: [RoomrateController],
  providers: [RoomrateService],
})
export class RoomrateModule {}
