import { IsEnum } from 'class-validator';
import { ReservationPaymentStatus } from '../../../generated/prisma';

export class UpdateReservationPaymentDto {
  @IsEnum(ReservationPaymentStatus)
  paymentStatus!: ReservationPaymentStatus;
}
