import { IsString } from 'class-validator';

export class AssignMaintenanceTicketDto {
  @IsString()
  assignedToId!: string;
}
