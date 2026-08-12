import { IsEnum } from 'class-validator';
import { RestaurantOrderStatus } from '../../../generated/prisma';

export class UpdateRestaurantOrderStatusDto {
  @IsEnum(RestaurantOrderStatus)
  status!: RestaurantOrderStatus;
}
