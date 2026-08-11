import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ChangeReservationRoomDto {
  @IsString()
  @IsNotEmpty()
  roomId!: string;

  @IsOptional()
  @IsString()
  roomRateId?: string;
}
