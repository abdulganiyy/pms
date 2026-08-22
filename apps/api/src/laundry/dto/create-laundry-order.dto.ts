import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLaundryOrderItemDto {
  @IsString()
  @IsNotEmpty()
  laundryItemId!: string;

  @IsInt()
  @Min(1)
  quantity!: number;
}

export class CreateLaundryOrderDto {
  @IsString()
  @IsNotEmpty()
  guestId!: string;

  @IsOptional()
  @IsString()
  reservationId?: string;

  @IsOptional()
  @IsString()
  folioId?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateLaundryOrderItemDto)
  items!: CreateLaundryOrderItemDto[];
}
