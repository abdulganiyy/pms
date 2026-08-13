import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { RoomStatusService } from './roomstatus.service';

@Module({
  controllers: [RoomController],
  providers: [RoomService, RoomStatusService],
})
export class RoomModule {}
