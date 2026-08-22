import { IsEnum, IsOptional, IsString } from 'class-validator';
import { LaundryOrderStatus } from '../../../generated/prisma';

export class UpdateLaundryOrderStatusDto {
  @IsEnum(LaundryOrderStatus)
  status!: LaundryOrderStatus;

  @IsOptional()
  @IsString()
  reason?: string;
}
