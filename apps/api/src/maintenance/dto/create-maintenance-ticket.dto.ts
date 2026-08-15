import { IsEnum, IsOptional, IsString } from 'class-validator';
import { MaintenancePriority } from '../../../generated/prisma';

export class CreateMaintenanceTicketDto {
  @IsOptional()
  @IsString()
  roomId?: string;

  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @IsOptional()
  @IsEnum(MaintenancePriority)
  priority?: MaintenancePriority;
}
