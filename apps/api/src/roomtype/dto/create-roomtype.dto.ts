import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateRoomTypeDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  code!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @Min(1)
  maxAdults!: number;

  @IsInt()
  @Min(0)
  maxChildren!: number;

  @IsInt()
  @Min(1)
  baseOccupancy!: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  size?: number;
}
