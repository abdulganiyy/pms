import { IsEnum, IsOptional, IsString } from 'class-validator';
import { GymMembershipStatus } from '../../../generated/prisma';

export class UpdateGymMembershipStatusDto {
  @IsEnum(GymMembershipStatus)
  status!: GymMembershipStatus;

  @IsOptional()
  @IsString()
  reason?: string;
}
