import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

import { RoomStatus } from '../../../generated/prisma';

export class CreateRoomDto {
  @IsString()
  @IsNotEmpty()
  number!: string;

  @IsEnum(RoomStatus)
  status!: RoomStatus;

  @IsInt()
  @Min(0)
  @IsOptional()
  floor?: number;

  @IsString()
  @IsNotEmpty()
  roomTypeId!: string;
}
