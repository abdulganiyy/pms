import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateGymMembershipDto {
  @IsString()
  @IsNotEmpty()
  guestId!: string;

  @IsOptional()
  @IsString()
  reservationId?: string;

  @IsString()
  @IsNotEmpty()
  planId!: string;

  @IsDateString()
  startDate!: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
