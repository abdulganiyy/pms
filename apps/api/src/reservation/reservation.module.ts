import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { RoomModule } from '../room/room.module';
import { FolioModule } from '../folio/folio.module';

@Module({
  imports: [RoomModule, FolioModule],
  controllers: [ReservationController],
  providers: [ReservationService],
})
export class ReservationModule {}
