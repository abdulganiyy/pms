import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRestaurantOrderItemDto {
  @IsString()
  menuItemId!: string;

  @IsInt()
  @Min(1)
  quantity!: number;
}

export class CreateRestaurantOrderDto {
  @IsOptional()
  @IsString()
  reservationId?: string;

  @IsOptional()
  @IsString()
  guestId?: string;

  //   @IsOptional()
  //   @IsString()
  //   roomNumber?: string;

  //   @IsString()
  //   waiterId!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRestaurantOrderItemDto)
  items!: CreateRestaurantOrderItemDto[];
}
