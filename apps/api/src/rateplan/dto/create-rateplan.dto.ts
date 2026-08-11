import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRatePlanDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  cancellationPolicy?: string;

  @IsBoolean()
  includesBreakfast!: boolean;

  @IsBoolean()
  refundable!: boolean;
}
