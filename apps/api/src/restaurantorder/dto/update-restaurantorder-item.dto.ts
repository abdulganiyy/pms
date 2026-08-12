import { IsInt, Min } from 'class-validator';

export class UpdateRestaurantOrderItemDto {
  @IsInt()
  @Min(1)
  quantity!: number;
}
