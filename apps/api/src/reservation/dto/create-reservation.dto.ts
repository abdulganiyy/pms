import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

import {
  ReservationPaymentStatus,
  ReservationStatus,
  ReservationType,
} from '../../../generated/prisma';

export class CreateReservationDto {
  @IsString()
  @IsNotEmpty()
  guestId!: string;

  @IsString()
  @IsNotEmpty()
  roomId!: string;

  @IsString()
  @IsNotEmpty()
  roomRateId!: string;

  @IsDateString()
  checkIn!: string;

  @IsDateString()
  checkOut!: string;

  @IsInt()
  @Min(1)
  adults!: number;

  @IsInt()
  @Min(0)
  children!: number;

  // @IsEnum(ReservationPaymentStatus)
  // paymentStatus!: ReservationPaymentStatus;

  @IsEnum(ReservationType)
  type!: ReservationType;

  // @IsEnum(ReservationStatus)
  // status!: ReservationStatus;

  @IsOptional()
  @IsString()
  discountCode?: string;
}
