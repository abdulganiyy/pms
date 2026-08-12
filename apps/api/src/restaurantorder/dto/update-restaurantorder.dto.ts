import { IsEnum, IsOptional, IsString } from 'class-validator';
import { RestaurantOrderStatus } from '../../../generated/prisma';

export class UpdateRestaurantOrderDto {
  @IsOptional()
  @IsString()
  waiterId?: string;

  @IsOptional()
  @IsString()
  roomNumber?: string;

  @IsOptional()
  @IsEnum(RestaurantOrderStatus)
  status?: RestaurantOrderStatus;
}
