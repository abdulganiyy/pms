import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CancelRestaurantOrderDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}
