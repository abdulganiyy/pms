import { IsEnum } from 'class-validator';
import { ReservationStatus } from '../../../generated/prisma';

export class UpdateReservationStatusDto {
  @IsEnum(ReservationStatus)
  status!: ReservationStatus;
}
