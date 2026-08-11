import { Module } from '@nestjs/common';
import { RoomtypeService } from './roomtype.service';
import { RoomtypeController } from './roomtype.controller';

@Module({
  controllers: [RoomtypeController],
  providers: [RoomtypeService],
})
export class RoomtypeModule {}
