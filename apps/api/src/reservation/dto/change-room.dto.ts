import { IsUUID } from 'class-validator';

export class ChangeRoomDto {
  @IsUUID()
  roomId!: string;
}
