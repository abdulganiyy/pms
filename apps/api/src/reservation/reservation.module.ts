import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { RoomModule } from '../room/room.module';

@Module({
  imports: [RoomModule],
  controllers: [ReservationController],
  providers: [ReservationService],
})
export class ReservationModule {}
