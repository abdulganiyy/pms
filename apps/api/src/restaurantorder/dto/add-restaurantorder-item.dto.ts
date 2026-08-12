import { IsInt, IsString, Min } from 'class-validator';

export class AddRestaurantOrderItemDto {
  @IsString()
  menuItemId!: string;

  @IsInt()
  @Min(1)
  quantity!: number;
}
