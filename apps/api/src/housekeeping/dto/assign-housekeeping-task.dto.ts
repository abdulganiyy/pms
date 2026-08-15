import { IsString } from 'class-validator';

export class AssignHousekeepingTaskDto {
  @IsString()
  assignedToId!: string;
}
