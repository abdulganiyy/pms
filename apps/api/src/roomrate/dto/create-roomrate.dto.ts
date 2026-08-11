import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';

export class CreateRoomRateDto {
  @IsString()
  @IsNotEmpty()
  roomTypeId!: string;

  @IsString()
  @IsNotEmpty()
  ratePlanId!: string;

  @IsDateString()
  startDate!: string;

  @IsDateString()
  endDate!: string;

  @IsNumber()
  @Min(0)
  price!: number;

  @IsString()
  @IsNotEmpty()
  currency!: string;
}
