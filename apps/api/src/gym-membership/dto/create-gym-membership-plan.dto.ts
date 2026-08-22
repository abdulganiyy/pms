import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

import { GymMembershipDuration } from '../../../generated/prisma';

export class CreateGymMembershipPlanDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(GymMembershipDuration)
  duration!: GymMembershipDuration;

  @IsInt()
  @Min(1)
  durationValue!: number;

  @IsNumber()
  @Min(0)
  price!: number;
}
